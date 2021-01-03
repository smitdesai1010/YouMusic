const express = require('express')
const audio = require('./my_modules/getaudio');
const content = require('./my_modules/getcontent')

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/iframes/:input', async (req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/plain'})
    res.end( await content.start(req.params.input) );
})


app.get('/media/:id', async (req,res)=>{ 
    res.writeHead(200, {'Content-Type': 'audio/mp3'});
    const mp3 = await audio.getdata(req.params.id)
    mp3.pipe(res)  
})


app.listen(PORT, () => console.log('Server connected at:', `localhost:${PORT}`));
