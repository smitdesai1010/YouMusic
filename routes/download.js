const ytdl = require('ytdl-core')
const audio = require('../my_modules/getmedia')
var express = require('express');
var router = express.Router();

router.get('/:id', async (req,res)=>{ 

    const stream = await audio.getdata(req.params.id,true)

    res.writeHead(200,{ "Content-Type": "audio/mp3" })
    stream.pipe(res) 
});


router.get('/info/:id', async (req,res)=>{ 

    const {player_response: { videoDetails: { title }  } } = await ytdl.getBasicInfo('https://www.youtube.com/watch?v='+req.params.id);

    res.writeHead(200,{ "Content-Type": "plain/text" })
    res.write(title)
    res.end()
});

module.exports = router;