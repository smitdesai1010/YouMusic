const fetch = require('node-fetch');
const fs = require('fs')
const { Readable } = require('stream')

//id = 'AgX2II9si7w'
//node server/my_modules/getaudio.js
const getdata = async(id) => {
    console.log(id)
 
    const response = await fetch('https://www.yt-download.org/api/button/mp3/'+id)
    const text = await response.text()
    const link = await parsecontent(text)

    const res = await fetch(link);
 
    return res.body

   /* const fileStream = fs.createWriteStream('./server/my_modules/mp3/file.mp3');

   // console.log(res.body)
   // let mp3 =  Readable.from(res.body._outBuffer)
   // console.log(mp3)
   
    await new Promise((resolve, reject) => {
        console.log('Into Pipeline') 
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve)
      }) */  
}

async function parsecontent(html){
    html = html.slice( html.indexOf('div') )
    html = html.slice( html.indexOf('https') )
    link = html.split('"',1)
    return String(link[0]);
}

//getdata(id)

exports.getdata = getdata