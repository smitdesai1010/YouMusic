var fetch = require('node-fetch')
var http = require('http')
var { Readable } = require('stream')

var server = http.createServer( abc )

async function abc(req,response) {
    url = 'https://www.yt-download.org/download/Jv8KRwF1zQs/mp3/320/1609877915/9f9b4384e5f2a04a6c1a91f397455827dcfdbc8c6ce3bb7f9024049bc33ec373/0'
    const readable = new Readable()
    readable._read = () => {}

    response.writeHead(200, {"Content-Type": "audio/mp3"});
    
    var res = await fetch(url)   
    var buffer = await res.buffer()
    console.log('from fetch: ',buffer.length)
   // https://www.w3schools.com/nodejs/met_buffer_slice.asp
    readable.push(buffer)
    readable.push(null)
    readable.pipe(response)  
    
}

server.listen(4000,() => console.log('localhost:4000'))



/*      console.log('buffer',buffer.length)
        console.log(typeof buffer[0])
        console.log(buffer[0][0],'The ele is 49 in buffer as it is stored in hex whereas 73 is decimal representation')
        buffer.forEach(ele => l += ele.length)
        console.log(l)
*/