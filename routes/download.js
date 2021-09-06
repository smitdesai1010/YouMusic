const ytdl = require('ytdl-core')
var express = require('express');
var router = express.Router();

router.get('/info/:id', async (req,res)=>{ 

    if (!/^[a-zA-Z0-9-_]{11}$/.test(req.params.id)){
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("Invalid Id");
        res.end();
    }

    const json = await ytdl.getBasicInfo('https://www.youtube.com/watch?v='+req.params.id)
                       .catch(err => console.log('Error in getting video info\n'+err))

    if (json == null) {
        res.sendStatus(404);
        return;
    }

    const {player_response: { videoDetails: { title }  } } = json
    const thumbnail = json.player_response.videoDetails.thumbnail.thumbnails.pop().url

    res.json({'Id':req.params.id,'Title':title,'Thumbnail':thumbnail})
    res.end()
});



router.get('/:id', async (req,res)=>{ 

    if (!/^[a-zA-Z0-9-_]{11}$/.test(req.params.id))
    {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("Invalid Id");
        res.end();
    }

    else{
        res.writeHead(200,{ "Content-Type": "audio/mp3" })     
        ytdl('https://www.youtube.com/watch?v='+req.params.id, {
            filter: 'audioonly',
            quality:'highestaudio'
        }).pipe(res);
    }
   
});


module.exports = router;