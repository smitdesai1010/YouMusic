const express = require('express');
const { Readable } = require('stream');
const audio = require('./my_modules/getaudio');
const content = require('./my_modules/getcontent')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/iframes/:input', async (req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.end( await content.start(req.params.input) );
})


app.get('/media/:id', async (req,res)=>{ 
    const data = await audio.getdata(req.params.id,false)

    if (data.Error)
        return res.status(data.Data);

    const mp3 = data.Data 
    console.log(mp3)
    
    res.writeHead(200, {'Content-Type': 'audio/mp3'});
    mp3.pipe(res)  
})


app.get('/download/:id', async (req,res)=>{ 

    const data = await audio.getdata(req.params.id,true)

    if (data.Error)
        return res.status(data.Data);

    const link = data.Data

    res.set('Content-Type','text/plain');
    res.status(200).send(link) 
})

app.listen(PORT, () => console.log('Server connected at:', `localhost:${PORT}`));
