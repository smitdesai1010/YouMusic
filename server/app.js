const http = require('http');
const fs = require('fs'); 
const audio = require('./audio');

let app = http.createServer( handlerequest );

async function handlerequest(req,res){
    if (req.method == "GET"){

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.writeHead(200, {'Content-Type': 'audio/mp3'});
       
        try{ fs.unlinkSync('audio/file.mp3') }
        catch(e){}

        var Id =  req.url.substring(req.url.indexOf('=')+1) 

        if (!fs.existsSync('audio/file.mp3'))
         audio.getdata(Id)
         .then(() => {
            console.log('done')
            let mp3 = fs.createReadStream('audio/file.mp3')
            mp3.pipe(res)      
         })    

            
    }
}

app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');
