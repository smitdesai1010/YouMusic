const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

 //try to find a way to throw a object as an error around
 //also see how will a catch block with a object react to a generic string error being throw
 //Have a better name than ifram since iframes are generated up on client side now


router.get('/:input', (req,res) => {

    let api = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + 
               process.env.YOUTUBEV3API + '&type=video&maxResults=10&q=' + req.params.input;

    fetch(api)
    .then(response => {
        if (response.status != 200) {
            throw `Error on YouTube Data V3 api \n${response.status}: ${response.statusText}`;
        }

        return response.json();
    })
    .then( ({items}) => { 
        if (!items) {
            throw 'Empty response from YouTube Data V3 api';
        }
        
        res.status(200);
        res.set({'Content-Type': 'application/json'})
        res.send( items.map(item => item.id.videoId) );
    })
    .catch(error => {
        res.status(404).send('Unable to fetch iframes. Please view server logs for more information');       
        console.log(error);             
    })

});


module.exports = router;