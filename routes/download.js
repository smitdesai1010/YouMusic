const audio = require('../my_modules/getmedia')
var express = require('express');
var router = express.Router();

router.get('/:id', async (req,res)=>{ 

    const stream = await audio.getdata(req.params.id,true)

    res.writeHead(200,{ "Content-Type": "audio/mp3" })
    stream.pipe(res) 
});


router.get('/info/:id', async (req,res)=>{ 

    const stream = await audio.getdata(req.params.id,true)

    res.writeHead(200,{ "Content-Type": "audio/mp3" })
    stream.pipe(res) 
});

module.exports = router;