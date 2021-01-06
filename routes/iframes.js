const content = require('../my_modules/getcontent')
var express = require('express');
var router = express.Router();

router.get('/:input', async (req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.end( await content.start(req.params.input) );
});


module.exports = router;