import {start} from './getcontent.js'

document.getElementsByClassName('form-inline')[0]
    .addEventListener( 'submit' , (e) => { 
        e.preventDefault() 
        var input = document.getElementsByClassName("form-control")[0].value;
        
        alert(input)

        if ( document.getElementById('buttons').style.display == "block" || document.getElementsByClassName("content")[0].innerHTML.indexOf('iframe') != -1){
            localStorage.setItem('input',input)
            window.location.reload()
            document.getElementsByClassName("form-control")[0].value = sessionStorage.getItem('input')
            console.log('H',localStorage.getItem('input'))
        }

        //document.querySelector('#CE').style.visibility = "hidden";
       
        start(input)

} )

