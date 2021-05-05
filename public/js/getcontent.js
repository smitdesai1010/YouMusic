function start(input){

    input = input + ' song';

    fetch(`iframes/${input}`)
    .then(res => res.text())
    .then(txt => {
        //hide the primary btns
        document.getElementById("primary buttons").style.visibility = "hidden";

        document.getElementsByClassName("content")[0].innerHTML = txt;

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "iframeapi"
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    })
    .catch(e => console.error('Error in Fetching contents: '+e))
}


export {start}