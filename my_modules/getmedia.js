const { Response } = require('node-fetch');
const ytdl = require('ytdl-core');

//id = 'AgX2II9si7w'
//node my_modules/getaudio.js
const getdata = async (id) => {

    if (!/^[a-zA-Z0-9-_]{11}$/.test(id))
      return null;

    var stream = ytdl('https://www.youtube.com/watch?v='+id, {
          filter: 'audioonly',
          quality: 'lowestaudio'
        })

    var buffer = await new Response(stream).buffer();
    return buffer; 

}


exports.getdata = getdata