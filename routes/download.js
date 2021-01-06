const audio = require('../my_modules/getaudio')
var express = require('express');
var router = express.Router();

router.get('/:id', async (req,res)=>{ 

    const data = await audio.getdata(req.params.id,true)

    if (data.Error)
        return res.status(data.Data);

    const link = data.Data

    res.set('Content-Type','text/plain');
    res.status(200).send(link) 
});


module.exports = router;