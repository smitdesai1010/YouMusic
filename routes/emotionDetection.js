var express = require('express');
const router = express.Router();
const emotionDection = require('../my_modules/getemotion');

router.post('/', async (req, res) => {
   emotion = await emotionDection.emotion(req);
  
   if (emotion == "no face detected")
   {
      res.writeHead(404,{'Content-Type': 'text/plain'})
      res.end( emotion );
   }

   else
   {
      res.writeHead(200,{'Content-Type': 'text/plain'})
      res.end( emotion );
   }

})

module.exports = router;