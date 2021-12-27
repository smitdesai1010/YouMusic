const { Readable } = require('stream');
const { Worker } = require('worker_threads');
const ytdl = require('ytdl-core')
const express = require('express');
const router = express.Router();


const cache = [];

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

        response.formats.forEach(format => {
            if (format.itag == 249)  {
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
        console.log('Error in getting video info\n'+err)
    })

});


router.get('/stream/:id', async (req,res) => { 

    let startTime = Date.now()
    
    //make this async
    
    if (!(req.params.id in cache)) {
        cache[req.params.id] = { 
            audioData: await getDataAsyncWorker(req.params.id)
        }
    }

    else
        cache[req.params.id].audioData = await getDataAsyncWorker(req.params.id);

    console.log('Time elapsed: ', Date.now() - startTime)

    if (cache[req.params.id].audioData == null) {
        res.status(404).send('Unable to stream');
        return;
    }    
    //https://stackoverflow.com/questions/42227944/err-content-length-mismatch-when-loading-video-in-chrome

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
    let numberOfChunks = 1;

    if ((id in cache) && cache[id].contentLength != null)
        numberOfChunks = Math.ceil((cache[id].contentLength / chunkSize));

    return new Promise((resolve, reject) => {
        worker.postMessage({
            'id': id,
            'chunkSize': chunkSize,
            'numberOfChunks': numberOfChunks
        });

        worker.on('message', (buffer) => {
                if (!buffer) {
                    console.error('Error in getDataAsyncWorker')
                    reject(null)
                }

                resolve(buffer);           
        });
    })
}



module.exports = router;