var input = document.getElementById('input'),
	ul = document.getElementById('reminder'),
	lis = document.getElementsByTagName('li'),
	pres = document.getElementsByClassName('pre'),
	keys = document.getElementsByClassName('key'),
	rests = document.getElementsByClassName('rest'),
	suggestData = ['java', 'javascript', 'css', 'html', 'css3' ,'html css', 
			'NodeJs', 'less', 'sass', 'JQuery', 'Html5', 'bootstrap',
			'document', 'Element', 'function', 'event', 'RegExp','cpp','ruby','pyhton',
			'word','c#','object C'];
function submit(keyword){};
function clearReminder(){
	for(var i = 0; i < lis.length; i++){
		pres[i].innerText = '';
		keys[i].innerText = '';
		rests[i].innerText = '';
		lis[i].className = 'hidden';
		ul.className = 'hidden';
	}
}
input.addEventListener('keyup',function(event){
	if(event.keyCode===40 || event.keyCode===38 ){
		return;
	}
	if(event.keyCode === 13){
		var select = document.getElementsByClassName('selected')[0];
		if(select){
			input.value = select.innerHTML.replace(/<span[^>]*>|<\/span>/g,'');
			clearReminder();
		}
		var keyword = input.value.replace(/(^\s+)|(\s+$)/g,'');
		submit(keyword);
	}else{
		var keyword = input.value.replace(/(^\s+)|(\s+$)/,'');
		keyword = keyword.replace(/(\s)+/g,' ');
		if(keyword===''){
			clearReminder();
		}else{
			var match=[];
			var index=[];
			for(var i = 0; i < suggestData.length; i++){
				if( (index[i]=suggestData[i].toLowerCase().indexOf(keyword.toLowerCase())) > -1 ){
					match[match.length] = i;
				}
			}
			ul.className = 'hidden';
			for(i = 0; i < match.length && i < lis.length; i++){
				pres[i].innerText = suggestData[match[i]].slice(0,index[match[i]]);
				keys[i].innerText = keyword;
				rests[i].innerText = suggestData[match[i]].slice(index[match[i]]+keyword.length);
				lis[i].className = 'active';
				ul.className = '';
			}
			for(var i = match.length; i < lis.length; i++){
				pres[i].innerText = '';
				keys[i].innerText = '';
				rests[i].innerText = '';
				lis[i].className = 'hidden';
			}
		}
	}
},false)

document.addEventListener('keyup',function(event){
	var keyCode = event.keyCode;
	if(keyCode == 38){	// 向上键
		var select = document.getElementsByClassName('selected')[0];
		if(select && select.previousElementSibling != undefined) {
			select.className = 'active';
			select.previousElementSibling.className = 'active selected';
		}
	}
	if(keyCode == 40){	//向下键
		var select = document.getElementsByClassName('selected')[0];
		if(select){
			var next = select.nextElementSibling;
			if(next != undefined && next.className.indexOf('active')>-1){
				next.className = 'active selected';
				select.className = 'active';
			}
		}else if(lis[0].className.indexOf('active')>-1){
			lis[0].className = 'active selected';
		}
	}
},false);

ul.addEventListener('click', function(event){
	var target = event.target;
	if(target instanceof HTMLUListElement){return}
	if(target instanceof HTMLSpanElement){
		target = target.parentNode;
	}
	input.value = target.innerHTML.replace(/<span[^>]*>|<\/span>/g, "");
	input.focus();
	clearReminder();
},false);
