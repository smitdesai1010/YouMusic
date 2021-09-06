require('dotenv').config();
const express = require('express')
const cors = require('cors')
const iframes = require('./routes/iframes')
const audio = require('./routes/audio')
// const emotionDetection = require('./routes/emotionDetection')

const app = express();
const PORT = process.env.PORT || 3000;


corsOption = { origin : 'chrome-extension://kggdmnnhhkmkbaggailkanenennjfiko' }

app.use(express.static('public'));
app.use('/iframes',iframes);
app.use('/audio',cors(corsOption) ,audio)
// app.use('/emotionDetection',emotionDetection)

app.all('*',(req,res) =>{
    res.writeHead(404,{'Content-Type': 'text/plain'})
    res.end('This is a invalid route');
})


app.listen(PORT, () => console.log('Server connected at:', `localhost:${PORT}`));
