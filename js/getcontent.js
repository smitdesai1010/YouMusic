import { generatehtml } from "./generatecontent.js";

function start(input){

    var key = 'AIzaSyCIYZSTbYtcgsmNNd5wEilrK0ByiUCMv7I'
    var api = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + 
               key + '&type=video&maxResults=10&q=' + input;

    fetchapi(api)
}


function fetchapi(api){
    fetch(api)
    .then( response => response.json() )
    .then( data => console.log(data)) //generatehtml(data.items) )
    .catch( e => console.log('Error'+e))
}


export {start}