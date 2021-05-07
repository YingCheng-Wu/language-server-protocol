import * as http from 'http'; 
import * as path from 'path'; 
import * as fs from 'fs'; 
import * as child_process from 'child_process'; 

process.chdir('../language-server-protocol/versions'); 
const cp = child_process.spawn('/Program Files/LLVM/bin/clangd.exe'); 
cp.stdout.setEncoding('utf-8'); 
cp.stderr.setEncoding('utf-8'); 
http.createServer((message, response)=>{ 
  const url = path.normalize(message.url); 
  response.setHeader('Access-Control-Allow-Origin', '*'); 
  function notFound(error?: Error) { console.log(error); response.writeHead(404); response.end(); } 
  if (url[0]=='.') { notFound(); } else { 
    const urlSplit = url.split(/[/\\]/); 
    if (urlSplit[1]=='api') { 
      const apiUrl = urlSplit[2]; 
      if (message.method=='POST') { 
        if (apiUrl=='clangd') { 
          const timer = setTimeout(()=>{ offDataCallback(stderrResult); }, 1e3); 
          let bodyLength = 0, result = '', contentLength = 0, stderrResult = ''; 
          function offDataCallback(stderrResult?: string) { cp.stdout.off('data', dataCallback); clearTimeout(timer); cp.stderr.off('data', stderrDataCallback); message.unpipe(cp.stdin); response.end(stderrResult||result); } 
          function dataCallback(data: string) { 
            result += data; console.log(data)
            if (contentLength===0) { 
              const rn = result.indexOf('\r\n'); 
              if (rn>-1) { 
                contentLength = parseInt(result.slice(result.indexOf('Content-Length:')+15, rn)); 
                if (contentLength) { bodyLength = result.slice(rn+1).length; } else { offDataCallback(); response.end(result); } 
                if (bodyLength>=contentLength) { offDataCallback(); } 
              } 
            } else { 
              bodyLength += data.length; 
              if (bodyLength>=contentLength) { offDataCallback(); } 
            } 
          } 
          function stderrDataCallback(data: string) { stderrResult += data; console.log(data); }
          cp.stdout.on('data', dataCallback); 
          cp.stderr.on('data', stderrDataCallback); 
          message.pipe(cp.stdin, {end: false}); message.on('data', data=>{ console.log(data.toString()); }); 
        } else if (apiUrl=='saveDefaultValues') {
          const writable = fs.createWriteStream('exampleMethods.txt'); 
          message.pipe(writable); 
          writable.on('error', notFound).on('close', ()=>{ response.end(); }); 
        } else { notFound(); } 
      } else { notFound(); } 
    } else { 
      const readable = fs.createReadStream('.'+url); 
      if (url.endsWith('.js')) { response.setHeader('Content-Type', 'application/javascript'); } else if (url.endsWith('.css')) { response.setHeader('Content-Type', 'text/css'); } 
      readable.on('error', notFound); 
      readable.pipe(response); 
    } } 
}).listen(58888); 