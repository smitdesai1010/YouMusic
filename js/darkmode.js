document.querySelector('#toggle-switch').addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    
    if (document.body.classList.contains('dark')){
        event.target.pseudoStyle("before","background-color","black");
        document.querySelectorAll('.btn-primary').forEach(ele => ele.style = "background-color: rgb(10, 106, 182)")
    }
        

    else{
        event.target.pseudoStyle("before","background-color","white");
        document.querySelectorAll('.btn-primary').forEach(ele => ele.style = "background-color: #007bff")
    
    }
          
})

var UID = {
	_current: 0,
	getNew: function(){
		this._current++;
		return this._current;
	}
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();
	
	_this.className +=  " "+className; 
	
	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};


