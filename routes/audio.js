const { Readable } = require('stream');
const { Response } = require('node-fetch');
const ytdl = require('ytdl-core')
const express = require('express');
const router = express.Router();

let buffer;
let Id;

router.use((req, res, next) => {
    const id = req.originalUrl.substr(req.originalUrl.lastIndexOf('/')+1);

    if (!/^[a-zA-Z0-9-_]{11}$/.test(id)) {
        res.set({"Content-Type": "text/plain"})
        res.status(404).send("Invalid YouTube video Id");
        return;
    }

    next();
})


router.get('/download/:id', (req,res) => { 

    res.writeHead(200,{ "Content-Type": "audio/mp3" })     
    ytdl('https://www.youtube.com/watch?v='+req.params.id, {
        filter: 'audioonly',
        quality:'highestaudio'
    }).pipe(res);

});


router.get('/info/:id', (req,res) => { 

    ytdl.getBasicInfo('https://www.youtube.com/watch?v='+req.params.id)
    .then(response => {
        if (response == null) {
            throw 'Response from fetching information is empty';
        }
    
        const {player_response: { videoDetails: { title }  } } = response
        const thumbnail = response.player_response.videoDetails.thumbnail.thumbnails.pop().url

        res.json({'Id':req.params.id,'Title':title,'Thumbnail':thumbnail});
    })
    .catch(err => {
        res.status(404).send('Unable to fetch info. Please view server logs for more information');
        console.log('Error in getting video info\n'+err)
    })

});


router.get('/stream/:id', async (req,res) => { 
    
    if (!Id || Id != req.params.id) {
        buffer = null;
        Id = req.params.id
    }    

    if (!buffer)
        buffer = await getdata(Id)

    if (buffer == null) {
        res.status(404).send('Unable to stream');
        return;
    }    
    //https://stackoverflow.com/questions/42227944/err-content-length-mismatch-when-loading-video-in-chrome

    const size = buffer.length
    const range = req.headers.range;
    
    if (range) {        
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


const getdata = async (id) => {

    if (!/^[a-zA-Z0-9-_]{11}$/.test(id))
      return null;

    var stream = ytdl('https://www.youtube.com/watch?v='+id, {
          filter: 'audioonly',
          quality: 'lowestaudio'
        })

    var buffer = await new Response(stream).buffer()
                 .catch(err => console.log('Error in getting buffer\n'+ err))
    return buffer; 

}

module.exports = router;