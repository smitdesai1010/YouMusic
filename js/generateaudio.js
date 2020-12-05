function parsecontent(html){
    html = html.slice( html.indexOf('div') )
    html = html.slice( html.indexOf('https') )
    html = html.split('"',1)
    modifycontent(html);
}

function modifycontent(link){

    link = String(link)
    
    if (link === "\n")
     {
         alert("Invalid Link");
         return;
     }

    document.getElementById("buttons").style = "display:block";

    document.getElementById("Download").href = link;

    document.getElementById("Listen").addEventListener('click', e =>{
        document.getElementById("music-player").style = "display:block"
        
        var audio = document.getElementById("audio");
        audio.src = link;
    })

}

export {parsecontent}