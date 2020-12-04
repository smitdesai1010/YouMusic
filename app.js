document.getElementsByClassName('form-inline')[0].addEventListener( 'submit' , (e) => { 
    e.preventDefault() 
    geturl();   
} )

function geturl(){
    var url = document.getElementsByClassName('form-control')[0].value;
    url = url.split("/",4)[3];
    request(url)
}

function request( url ){ 
    fetch('https://www.yt-download.org/api/button/mp3/'+url)
    .then(response => response.text())
    .then(text => parsecontent(text))
    .catch(err => console.log('Failed to fetch page: ', err)  ); 
}

function parsecontent(html){
    html = html.slice( html.indexOf('div') )
    html = html.slice( html.indexOf('https') )
    html = html.split('"',1)
    modifycontent(html);
}

function modifycontent(link){

    document.getElementById("buttons").style = "display:block";

    document.getElementById("Download").href = link;
    
    document.getElementById("Listen").addEventListener('click', e =>{
        document.getElementById("music-player").style = "display:block"
        
        var audio = document.getElementById("audio");
        audio.src = link;
    })

}

//https://youtu.be/9iIX4PBplAY

