const fs = require('fs')
const fetch = require('node-fetch');

//id = 'AgX2II9si7w'
const getdata = async(id) => {
    console.log(id)
 
    const response = await fetch('https://www.yt-download.org/api/button/mp3/'+id)
    const text = await response.text()
    const link = await parsecontent(text)
      
    const res = await fetch(link);
     const fileStream = fs.createWriteStream('audio/file.mp3');
    
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve)
      })  
}

async function parsecontent(html){
    html = html.slice( html.indexOf('div') )
    html = html.slice( html.indexOf('https') )
    link = html.split('"',1)
    return String(link[0]);
}

exports.getdata = getdata