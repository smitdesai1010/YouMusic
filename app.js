var output = document.getElementById("output");
output.style = "display : none";

var form = document.getElementsByClassName('form-inline')[0].addEventListener( 'submit' , (e) => { 
    e.preventDefault() 
    geturl();   
} )

function geturl(){
    var url = document.getElementsByClassName('form-control')[0].value;
    url = url.split("/",4)[3];
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
        modifycontent(a);
       
    }  
}

function modifycontent(link){

    output.style = "display:block";

    document.getElementById("Download").href = link;
    
    const audio = document.createElement('audio');
    audio.src = link;
    audio.classList.add("embed-responsive-item");

    document.getElementById("audio").appendChild(audio);

}

//https://youtu.be/9iIX4PBplAY

