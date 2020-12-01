document.getElementById("abc").innerHTML = "Hello World";

const Http = new XMLHttpRequest();
const url='https://www.yt-download.org/api/button/mp3/9iIX4PBplAY';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
    document.getElementById('a').innerHTML = Http.responseText;
    console.log('ok')
}

//https://youtu.be/9iIX4PBplAY