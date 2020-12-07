function onYouTubeIframeAPIReady() {
  
  console.log('hey')

  for (var i=0; i<10; ++i){
    new YT.Player('iframe'+i, a = {
      events: {
        'onStateChange': e => e.data == 1 ? console.log("started") : console.log("No"),  
      }
    });
  }

  }

 
