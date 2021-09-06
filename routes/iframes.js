const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

router.get('/:input', (req,res) => {

    let api = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + 
               process.env.YOUTUBEV3API + '&type=video&maxResults=10&q=' + req.params.input;

    fetch(api)
    .then(response => {
        if (response.status != 200) {
            res.status(response.status).send('Unable to fetch video list: '+response.statusText);
            throw new Error(`Error on YouTube Data V3 api \n${response.status}: ${response.statusText}`);
        }

        else {
            return response.json();
        }
    })
    .then( ({items}) => { 
        if (!items) {
            res.status(404).send('Unable to convert to iframe');
            throw new Error('Unable to convert to iframe');
        }
        
        res.status(200);
        res.set({'Content-Type': 'application/json'})
        res.send( items.map(item => item.id.videoId) );
    })
    .catch(console.log)

});



module.exports = router;