const { Readable } = require('stream');
const { Worker } = require('worker_threads');
const ytdl = require('ytdl-core')
const express = require('express');
const router = express.Router();


const cache = [];

/*
[
    {
        key: id
        value: {
            contentLength: Number,
            audioData: Uint8Array
        }
    }
]
*/

router.use((req, res, next) => {
    // LEFT: check if video exists or not
    const id = req.originalUrl.substr(req.originalUrl.lastIndexOf('/')+1);

    if (!/^[a-zA-Z0-9-_]{11}$/.test(id)) {
        res.set({"Content-Type": "text/plain"})
        res.status(404).send("Invalid YouTube video Id");
        return;
    }

    next();
})


//check if video already exists

router.get('/download/:id', (req,res) => { 
    res.writeHead(200,{ "Content-Type": "audio/mp3" })     

    //check if video already exists
    if (req.params.id in cache && "audioData" in cache[req.params.id]) {
        res.write(cache[req.params.id].audioData)
        res.end()
    } 
    else {
        ytdl('https://www.youtube.com/watch?v='+req.params.id, {
            filter: 'audioonly',
            quality:'highestaudio'
        }).pipe(res)
    }

});


router.get('/info/:id', (req,res) => { 

    ytdl.getBasicInfo('https://www.youtube.com/watch?v='+req.params.id)
    .then(response => {
        if (response == null) {
            throw 'Response from fetching information is empty';
        }

        response.formats.forEach(format => {

            if (format.itag == 251) {   //highest audio format
                if (!(req.params.id in cache))
                    cache[req.params.id] = {
                        contentLength: format.contentLength
                    }
                else
                    cache[req.params.id].contentLength = format.contentLength
            } 
        })

        const {player_response: { videoDetails: { title }  } } = response
        const thumbnail = response.player_response.videoDetails.thumbnail.thumbnails.pop().url

        res.json({'Id':req.params.id,'Title':title,'Thumbnail':thumbnail});
    })
    .catch(err => {
        res.status(404).send('Unable to fetch info. Please view server logs for more information');
        console.log('Error in getting audio info\n'+err)
    })

});


router.get('/stream/:id', (req,res,next) => {     
    /*
        req.params.id doesn't exists 
                    OR
        req.params.id exists but doesn't contain audioData (it has only contentLengh)
    */
    if (!(req.params.id in cache && "audioData" in cache[req.params.id])) {

        if (!(req.params.id in cache)) {    //object doesn't exists 
            cache[req.params.id] = {}
        }

        getDataAsyncWorker(req.params.id)
        .then(bufferData => {

            if (bufferData == null) {
                throw 'bufferData is null';  //put a good error message
            }

            cache[req.params.id].audioData = bufferData;
            cache[req.params.id].contentLength = bufferData.length;
            next();
        })
        .catch(error => {
            console.log('Error in getting audio: ',error)
            res.status(404).send('Unable to stream, Please view server logs for more details');
        })
    }

    else {      //already exists in cache
        next()
    }
 
});


router.get('/stream/:id', (req,res,) => { 
    const size = cache[req.params.id].audioData.length
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
        readable.push(cache[req.params.id].audioData.slice(start,end+1))
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
        readable.push(cache[req.params.id].audioData)
        readable.push(null)
        readable.pipe(res)  
    } 
});



const getDataAsyncWorker = (id) => {
    const worker = new Worker('./routes/asyncWorker.js');
    const chunkSize = 1000 * 1024;   //1Mb
    let numberOfChunks = 1;    //default number of chunks

    if ((id in cache) && cache[id].contentLength != null)   //if contentlength is present, calculate the number of chunks
        numberOfChunks = Math.ceil((cache[id].contentLength / chunkSize));

    return new Promise((resolve, reject) => {
        worker.postMessage({
            'id': id,
            'chunkSize': chunkSize,
            'numberOfChunks': numberOfChunks
        });

        /*
            What if some other worker thread returns a different chunk ?
        */

        worker.on('message', (buffer) => {
            if (!buffer) {
                console.error('Error in getDataAsyncWorker')
                reject(null)
            }

            resolve(buffer);           
        });
    })
}

//check if video exists or not

/*
Things learnt:
    Make api's independent of frontend
    For example: frontend will only send api's with valid id 
                 but what if someone calls the api manually with invalid api
*/

module.exports = router;



//https://stackoverflow.com/questions/42227944/err-content-length-mismatch-when-loading-video-in-chrome
