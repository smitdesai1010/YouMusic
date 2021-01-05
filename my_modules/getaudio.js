const fetch = require('node-fetch');
const fs = require('fs');

//id = 'AgX2II9si7w'
//node my_modules/getaudio.js
const getdata = async(id,download) => {

    const response = await fetch('https://www.yt-download.org/api/button/mp3/'+id);
    const text = await response.text();
    const link = await parsecontent(text);
    
    if (link.includes('HTTP 429'))
        return {Data: "HTTP 429" , Error: true}

    if (download)
        return {Data: link , Error: false};
        
    const res = await fetch(link);
    return {Data: res.body , Error: false};
}

async function parsecontent(html){

    if (html.includes('HTTP 429'))
        return "HTTP 429: Too many requests"

    html = html.slice( html.indexOf('div') )
    html = html.slice( html.indexOf('https') )
    link = html.split('"',1)
    return String(link[0]);
}

//getdata(id,false)

exports.getdata = getdata