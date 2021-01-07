function onYouTubeIframeAPIReady() {

  for (var i=0; i<10; ++i){
     new YT.Player('iframe'+i,{
      events: {
        'onStateChange': e => e.data == -1 ? request(e.target.getVideoUrl()) : ""  
      }
    })
  }

  }

function request( url ){ 
  
  if (url == "")
    return

    var Id = url.substring( url.indexOf('=') + 1 )  
    document.getElementById("iframecontainer").innerHTML = ''

   document.getElementById("buttons").style = "display:block";
   document.getElementById("Listen").addEventListener('click', e => document.getElementById("music-player").style = "display:block")
   
   fetch(`download/info/${Id}`)
   .then(res => res.text())
   .then(text => document.querySelector('#Download').download = text+'.mp3')
   .catch(err => console.log(err)) 

   document.querySelector('#Download').href = `download/${Id}`
   document.querySelector('audio').src = `media/${Id}` 
  }