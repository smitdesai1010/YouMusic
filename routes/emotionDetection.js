var express = require('express');
const router = express.Router();
const emotionDection = require('../my_modules/getemotion');

router.post('/', async (req, res) => {
   response = await emotionDection.emotion(req);
   console.log('Emotion '+ response);
})

module.exports = router;