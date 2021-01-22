const { Response } = require('node-fetch');
const ytdl = require('ytdl-core');

//id = 'AgX2II9si7w'
//node my_modules/getaudio.js
const getdata = async(id,download) => {

    if (!/^[a-zA-Z0-9-_]{11}$/.test(id))
      return null
      
    var stream = ytdl('https://www.youtube.com/watch?v='+id, {
            filter: 'audioonly',
            quality: download ? 'highestaudio' :'lowestaudio'
      })
    
    if (download)  
      return stream;
    
    else  
      return await getbuffer(stream);   
}

var getbuffer = async (stream) => await new Response(stream).buffer()

//getdata(id,false)
 

exports.getdata = getdata