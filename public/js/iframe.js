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

    let Id = url.substring( url.indexOf('=') + 1 )  
    document.getElementById("iframecontainer").innerHTML = ''

    document.getElementById("secondary buttons").style = "display: block";
    document.querySelector(".fa-download").addEventListener( 'click', e => document.querySelector('#Download').click() )

    document.getElementById("Listen").addEventListener('click', e => {
          document.getElementById("music-player").style = "display:block"
          document.getElementById("secondary buttons").style = "display: none";  
    })
   
   fetch(`audio/info/${Id}`)
   .then(res => {
      if (res.ok)
        return res.json()

      else
        throw new Error(res.status) 
   })
   .then(json => {
      document.querySelector('#Download').download = json.Title+'.mp3';
      document.querySelector('#Download').href = `audio/download/${Id}`;
      loadmusicplayer(Id);
    })
   .catch(err => console.log(err)) 
  }
