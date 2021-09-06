//-----clears search text on clicking croxx btn--------
document.querySelectorAll('.search-box input[type="text"] + span')[0]
    .addEventListener('click', (e) => {
		e.target.previousElementSibling.value = '';
});
//-------------------------------------------------

document.getElementById('submit').addEventListener('click', fetchIframes);
document.getElementsByClassName('form-inline')[0].addEventListener( 'submit' , fetchIframes);

function fetchIframes(e) {
    e.preventDefault();
    let input = document.getElementById("form-control").value + ' song';

    fetch(`iframes/${input}`)
    .then(response => {
        if (response.status != 200)
            throw response.status+': '+response.statusText;
        
        return response.json();
    })
    .then(json => {
        //load iframe html code from youtube id
        let i = 0;
        let iframeHTML = '';
        json.forEach(ele => iframeHTML += `<iframe id='iframe${i++}' src='https://www.youtube.com/embed/${ele}?enablejsapi=1' class="mt-2"></iframe>\n`); 
        document.getElementsByClassName("content")[0].innerHTML = iframeHTML;

        //hide the primary btns
        document.getElementById("primary buttons").style.visibility = "hidden";

        //loads iframe api
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "iframeapi"
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    })
    .catch(error => console.error('Error in Fetching contents: '+error))
}
