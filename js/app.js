import {start} from './getcontent.js'

alert("Under maintaince due to a security bug")

document.getElementsByClassName('form-inline')[0]
    .addEventListener( 'submit' , (e) => { 
        e.preventDefault() 
        var input = document.getElementsByClassName("form-control")[0].value;
        start(input)

} )

