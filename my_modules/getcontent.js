const fetch = require('node-fetch');

const start = async (input) => {
    
    var key = 'AIzaSyCBzpx4xw5wL8JRXMasNJKxarraAqtbdkU';
    var api = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + 
               key + '&type=video&maxResults=10&q=' + input;
    var data;

    try{
        var response = await fetch(api)
   
        if (response.status != 200) 
            throw `Error on YouTube Data V3 api \n${response.status}: ${response.statusText}`

        data = await response.json()
    }
    
    catch(e) {
        console.error(e)
        return e;
    }
    
    return generateframes(data.items) 
}




function generateframes(data){

    if (!data)
        return 'NA'

    var arr = data.map( ele => ele.id.videoId )
    var i = 0;
    var str = ''
    
    arr.forEach(ele => str += `<iframe id='iframe${i++}' src='https://www.youtube.com/embed/${ele}?enablejsapi=1' class="mt-2"></iframe>\n`); 

    return str;
}


exports.start = start