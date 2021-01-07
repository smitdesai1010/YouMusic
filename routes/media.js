const { Readable } = require('stream');
const audio = require('../my_modules/getmedia');
var express = require('express');
var router = express.Router();

var buffer;

router.get('/:id', async (req,res)=>{ 
           
    if (!buffer)
        buffer= await audio.getdata(req.params.id,false)

     
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
});


module.exports = router;