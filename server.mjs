import http from 'node:http';
import {readFile} from 'node:fs/promises';
const base='https://www.runninghub.cn/openapi/v2/', key=process.env.RUNNINGHUB_API_KEY;
if(!key) throw Error('请在 .env 配置 RUNNINGHUB_API_KEY');
const routes={'/generate':'rhart-image-n-pro-official/text-to-image','/edit':'rhart-image-n-pro-official/edit','/upload':'media/upload/binary','/query':'query'};
http.createServer(async(req,res)=>{
 try{
 if(req.headers.host!=='127.0.0.1:8787' && req.headers.host!=='localhost:8787') throw Error('无效主机');
 if(req.url==='/' && req.method==='GET'){res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(await readFile(new URL('./index.html',import.meta.url)))}
 if(req.method!=='POST'||!Object.hasOwn(routes,req.url)||req.headers['x-studio']!=='1') throw Error('无效请求');
 let chunks=[],size=0;for await(const c of req){size+=c.length;if(size>10*1024*1024)throw Error('文件超过 10 MB');chunks.push(c)}
 let raw=Buffer.concat(chunks),headers={Authorization:'Bearer '+key},body;
 if(req.url==='/upload'){let type=req.headers['content-type'];let ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[type];if(!ext)throw Error('请选择 PNG、JPEG 或 WebP');body=new FormData();body.append('file',new Blob([raw],{type}),'reference.'+ext)}
 else{let p=JSON.parse(raw);if(req.url!=='/query'&&!p.prompt?.trim())throw Error('请输入提示词');body=JSON.stringify(p);headers['Content-Type']='application/json'}
 let r=await fetch(base+routes[req.url],{method:'POST',headers,body,redirect:'error',signal:AbortSignal.timeout(90000)});let data=await r.json();res.writeHead(r.status,{'Content-Type':'application/json'});res.end(JSON.stringify(data))
 }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({errorMessage:e.message}))}
}).listen(8787,'127.0.0.1',()=>console.log('打开 http://127.0.0.1:8787'));
