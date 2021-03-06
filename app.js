require('dotenv').config();
const express = require('express')
const cors = require('cors')
const iframes = require('./routes/iframes')
const media = require('./routes/media')
const download = require('./routes/download')
// const emotionDetection = require('./routes/emotionDetection')

const app = express();
const PORT = process.env.PORT || 3000;


corsoption = { origin : 'chrome-extension://kggdmnnhhkmkbaggailkanenennjfiko' }

app.use(express.static('public'));
app.use('/iframes',iframes);
app.use('/media',cors(corsoption) ,media)
app.use('/download',cors(corsoption) ,download)
// app.use('/emotionDetection',emotionDetection)

app.all('*',(req,res) =>{
    res.writeHead(404,{'Content-Type': 'text/plain'})
    res.end('This is a invalid route');
})


app.listen(PORT, () => console.log('Server connected at:', `localhost:${PORT}`));
