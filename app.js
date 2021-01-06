const express = require('express');
const { Readable } = require('stream');
const audio = require('./my_modules/getaudio');
const content = require('./my_modules/getcontent')

const app = express();
const PORT = process.env.PORT || 3000;
var buffer

app.use(express.static('public'));

app.get('/iframes/:input', async (req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.end( await content.start(req.params.input) );
})


app.get('/media/:id', async (req,res)=>{ 
           
    if (!buffer){
      const data = await audio.getdata(req.params.id,false)
    
      if (data.Error)
          return res.status(data.Data);
    
      buffer = data.Data
    }
     
    const size = buffer.length
    const range = req.headers.range;
    
    if (range){
        console.log('range')
        
        let [start, end] = range.replace(/bytes=/, "").split("-");
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;
        
        if (!isNaN(start) && isNaN(end)) {
            start = start;
            end = size - 1;
        }

        if (isNaN(start) && !isNaN(end)) {
            start = size - end;
            end = size - 1;
        }
        
        
        if (start >= size || end >= size) {
            res.writeHead(416, {"Content-Range": `bytes */${size}`});
            return res.end();
        }
        
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "audio/mp3"
        });
        
        const readable = new Readable()
        readable._read = () => {}
        readable.push(buffer.slice(start,end))
        readable.push(null)
        readable.pipe(res)  
    }
    
    else{
        console.log('not range ',buffer.length)
        
        res.writeHead(200, {
            "Content-Length": size,
            "Content-Type": "audio/mp3"
        });
        
        const readable = new Readable()
        readable._read = () => {}
        readable.push(buffer)
        readable.push(null)
        readable.pipe(res)  
    } 
})


app.get('/download/:id', async (req,res)=>{ 

    const data = await audio.getdata(req.params.id,true)

    if (data.Error)
        return res.status(data.Data);

    const link = data.Data

    res.set('Content-Type','text/plain');
    res.status(200).send(link) 
})

app.listen(PORT, () => console.log('Server connected at:', `localhost:${PORT}`));
