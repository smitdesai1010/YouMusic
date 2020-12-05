import {start} from './getcontent.js'

document.getElementsByClassName('form-inline')[0]
    .addEventListener( 'submit' , (e) => { 
        
        e.preventDefault() 
        var input = document.getElementsByClassName("form-control")[0].value;
        
        start(input)

} )




//https://youtu.be/9iIX4PBplAY

