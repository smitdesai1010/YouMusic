const ytdl = require('ytdl-core')
const audio = require('../my_modules/getmedia')
var express = require('express');
var router = express.Router();

router.get('/:id', async (req,res)=>{ 
    
    const stream = await audio.getdata(req.params.id,true)

    if (!stream){
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("Invalid Id");
        res.end();
    }

    else{
        res.writeHead(200,{ "Content-Type": "audio/mp3" })
        stream.pipe(res) 
    }
   
});


router.get('/info/:id', async (req,res)=>{ 

    if (!/^[a-zA-Z0-9-_]{11}$/.test(req.params.id)){
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("Invalid Id");
        res.end();
    }

    const json = await ytdl.getBasicInfo('https://www.youtube.com/watch?v='+req.params.id);
    const {player_response: { videoDetails: { title }  } } = json
    const thumbnail = json.player_response.videoDetails.thumbnail.thumbnails.pop().url

    res.json({'Id':req.params.id,'Title':title,'Thumbnail':thumbnail})
    res.end()
});

module.exports = router;