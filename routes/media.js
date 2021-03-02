const { Readable } = require('stream');
const audio = require('../my_modules/getmedia');
var express = require('express');
var router = express.Router();

var buffer;
var Id;

router.get('/:id', async (req,res)=>{ 
    
    if (!Id || Id != req.params.id){
        buffer = null;
        Id = req.params.id
    }    

    if (!buffer)
        buffer= await audio.getdata(Id,false)

//https://stackoverflow.com/questions/42227944/err-content-length-mismatch-when-loading-video-in-chrome

    const size = buffer.length
    const range = req.headers.range;
    
    if (range){        
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
        readable.push(buffer.slice(start,end+1))
        readable.push(null)
        readable.pipe(res)  
    }
    
    else{        
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