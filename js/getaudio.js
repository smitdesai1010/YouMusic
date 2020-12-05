import {parsecontent} from './generateaudio.js'

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
