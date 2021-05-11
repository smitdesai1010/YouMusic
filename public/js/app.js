import {start} from './getcontent.js'

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
    
        start(input+' song')

} )

