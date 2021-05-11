import {start} from './getcontent.js'

document.getElementById("clickPic").addEventListener("click",async () => {
    
    let mediaStream = null;
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
                  .catch(error => console.log('Unable to get user media for camera: '+error))
   
    if ( mediaStream != null ) 
    {
        const track = mediaStream.getVideoTracks()[0];
        let imageCapture = new ImageCapture(track);

        let blob = await imageCapture.takePhoto()
                        .catch(error => {console.log('takePhoto() error: ', error) });
        
        //document.getElementById("img").src = URL.createObjectURL(blob);     
        mediaStream.getVideoTracks().forEach(track => track.stop());   
    
        fetch('/emotionDetection',{
            method: 'POST',
            body: blob,
        })
        .then(res => {
            if (!res.ok)
            {
                if (res.status == 404)
                    alert("Unable to detect face");

                throw new Error("Error while sending the picture for further processing " + res.status);
            }
            
            return res.text();
        })
        .then(txt => {
            var lang = prompt('Enter language in which you would like to hear songs');
            start(txt+' '+lang)
        })
        .catch(error => console.log(error))

    }
    
})

 