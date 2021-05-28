//-----clears search text on clicking croxx btn--------
document.querySelectorAll('.search-box input[type="text"] + span')[0]
    .addEventListener('click', (e) => {
		e.target.previousElementSibling.value = '';
});
//-------------------------------------------------


document.getElementById('submit')
    .addEventListener('click', (e) => {
        e.stopPropagation();
        var input = document.getElementById("form-control").value;
    
        start(input+' song')
})

document.getElementsByClassName('form-inline')[0]
    .addEventListener( 'submit' , (e) => { 
        e.preventDefault() 
        var input = document.getElementById("form-control").value;
    
        getContent(input+' song')

})

function getContent(input){

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


