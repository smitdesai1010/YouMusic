import { generateframes } from "./generatecontent.js";

function start(input){

    var key = 'AIzaSyAO4VExmqe0ighfBUyCw9QgX4li5tlOUZ4'
    var api = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + 
               key + '&type=video&maxResults=10&q=' + input;

    fetchapi(api)
}


function fetchapi(api){
    fetch(api)
    .then( response => response.json() )
    .then( data => generateframes(data.items) )
    .catch( e => console.log('Error'+e))
}


export {start}