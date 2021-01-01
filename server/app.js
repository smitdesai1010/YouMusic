const http = require('http');
const fs = require('fs'); 
const url = require('url');
const audio = require('./my_modules/getaudio');
const content = require('./my_modules/getcontent')

let app = http.createServer( handlerequest );

async function handlerequest(req,res){
    if (req.method == "GET"){

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        var query = url.parse(req.url,true).query 

        if (query.key){
            res.writeHead(200,{'Content-Type': 'text/plain'})
            res.end( await content.start(query.key) );
        }


        if (query.Id){
            res.writeHead(200, {'Content-Type': 'audio/mp3'});
            const mp3 = await audio.getdata(query.Id)
            mp3.pipe(res)      
        }
    }
}

app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');
