const express = require('express');
const iframes = require('./routes/iframes')
const media = require('./routes/media')
const download = require('./routes/download')

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'));
app.use('/iframes', iframes);
app.use('/media',media)
app.use('/download',download)


app.listen(PORT, () => console.log('Server connected at:', `localhost:${PORT}`));
