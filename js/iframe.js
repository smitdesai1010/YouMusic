function onYouTubeIframeAPIReady() {
  console.log('hey')
  for (var i=0; i<10; ++i){
     new YT.Player('iframe'+i,{
      events: {
        'onStateChange': e => e.data == -1 ? request(e.target.getVideoUrl()) : "",  
      }
    })
  }

  }

function request( url ){ 
  
  if (url == "")
    return

    var Id = url.substring( url.indexOf('=') + 1 )  
    document.getElementById("iframecontainer").innerHTML = ''
  
    /*
    fetch('https://www.yt-download.org/api/button/mp3/'+url)
    .then(response => response.text())
    .then(text => parsecontent(text))
    .catch(err => console.log('Failed to fetch page: ', err)  ); 
    */

   fetch("http://localhost:3000?Id="+Id)
   .then(res => {console.log(res); return res.blob()})
   .then(blob => {
          document.querySelector('source').src = URL.createObjectURL(blob)
          document.getElementById("buttons").style = "display:block";

         // document.getElementById("Download").href = link;

          document.getElementById("Listen").addEventListener('click', e =>{
            document.getElementById("music-player").style = "display:block"
          })
    })
   .catch(err => console.error(err))

  }

/*
function parsecontent(html){
    html = html.slice( html.indexOf('div') )
    html = html.slice( html.indexOf('https') )
    html = html.split('"',1)
    modifycontent(html);
}
*/

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
