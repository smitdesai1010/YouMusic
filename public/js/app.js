import {start} from './getcontent.js'

document.getElementsByClassName('form-inline')[0]
    .addEventListener( 'submit' , (e) => { 
        e.preventDefault() 
        var input = document.getElementById("form-control").value;
    
        //document.querySelector('#CE').style.visibility = "hidden";
        start(input);
} )

