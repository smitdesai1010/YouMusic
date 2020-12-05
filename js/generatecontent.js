

var content = document.getElementsByClassName("content")[0];
var parser = new DOMParser();
    
function generatehtml(arr){

    console.log(arr)
    arr.forEach(ele => {

        var html = ` <li onclick="alert('hello')" class="d-flex justify-content-start mt-5" style="background-color: #F4F4F4;">
                            <img src=`+ ele.snippet.thumbnails.medium.url +` alt="img">
                            
                            <div class="container-fluid">
                              `+ ele.snippet.title +`
                            </div>
                        </li>`

        var a = document.createElement('div')
        a.innerHTML = html

        content.appendChild(a)

    });

}

export {generatehtml}