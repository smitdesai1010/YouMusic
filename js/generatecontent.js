var content = document.getElementsByClassName("content")[0];


function generateframes( data ){
    var arr = data.map( ele => ele.id.videoId )
    createframes(arr)
    
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = "iframeapi"
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
}


function createframes(arr){
    var i = 0;
    arr.forEach(ele => {

       var iframe = document.createElement('iframe')
       iframe.id = 'iframe'+i;
       iframe.src = 'https://www.youtube.com/embed/'+ele+'?enablejsapi=1'
       iframe.classList.add("mt-2")
       content.appendChild(iframe) 
       ++i;
    });   
}


export {generateframes}