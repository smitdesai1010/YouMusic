
var form = document.getElementsByClassName('form-inline')[0].addEventListener( 'submit' , (e) => { 
    e.preventDefault() 
    geturl();   
} )

function geturl(){
    var url = document.getElementsByClassName('form-control')[0].value;
    url = url.split("/",4)[3];
    //console.log(url);
    request(url)
}


function request( url ){

    const Http = new XMLHttpRequest();
    url='https://www.yt-download.org/api/button/mp3/'+url;
    Http.open("GET", url);
    Http.send();
    
    Http.onreadystatechange = (e) => {
        var a = Http.responseText;

        a = a.slice( a.indexOf('div') )
        a = a.slice( a.indexOf('https') )
        a = a.split('"',1)
        console.log(a);

        document.getElementById('output').innerHTML = a;

        const audio = document.createElement('audio');
        audio.src = a;
       // audio.play();
    }  
}



//https://youtu.be/9iIX4PBplAY

