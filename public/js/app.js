import {start} from './getcontent.js'

document.getElementsByClassName('form-inline')[0]
    .addEventListener( 'submit' , (e) => { 
        e.preventDefault() 
        var input = document.getElementsByClassName("form-control")[0].value;
        document.querySelector('#CE').style.visibility = "hidden";
       
        start(input)

} )

