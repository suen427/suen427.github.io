//滚轮事件
var num = 0;
// var acc = 0;
var flag = true;
var lis = document.getElementById('pp-nav').getElementsByTagName('a');

var scrollFunc=function(e){ 
	e=e || window.event; 	
	if(e.wheelDelta){//IE/Opera/Chrome 
		if(e.wheelDelta==120){
			if(flag){
				flag = false;
				scroll(num-1);
			}
		}else{
			if(flag){
				flag = false;
				scroll(num+1);
			}
		} 
	}else if(e.detail){ 
		if(e.detail==-3) { 
			if(flag){
				flag = false;
				scroll(num-1);
			}
		}else { 
			if(flag){
				flag = false;
				scroll(num+1);
			}
		} 
	}
	e.preventDefault();
}; 

function scroll(page){
	var pps = document.getElementsByClassName('section');
	var len = pps.length;
	num = (page+7)%7;
	for( var i = 0; i<num; i++ ){
		pps[i].className = 'section center pp-section pp-table leaving'
		pps[i].style.zIndex = (7-i);
		if(pps[i].style.transform != null){
			pps[i].style.transform = 'translate3d(0px, -100%, 0px)';
		}else{
			pps[i].style.top = '-2000px';
		}
	}
	for( var i = num; i<len; i++ ){
		pps[i].className = 'section center pp-section pp-table active'
		pps[i].style.zIndex = (7-i);
		if(pps[i].style.transform != null){
			pps[i].style.transform = 'translate3d(0px, 0px, 0px)';
		}else{
			pps[i].style.top = '0';
		}
	}
	for(var i = 0; i<len; i++){
		lis[i].className= '';
	}
	lis[num].className= 'active';
	setTimeout(function(e){
		flag = true;
	},800);
}

if(document.addEventListener){
	document.addEventListener("DOMMouseScroll" ,scrollFunc, false); 
}
window.onmousewheel=document.onmousewheel=scrollFunc;


//nav指示器点击事件
function navclick(e){
	e=e || window.event;
	var tooltips = ['Home', 'Projects', 'Professions', 'Education', 'Internship', 'Jobs Preferred', 'Contact Me'];
	var target = e.target || e.srcElement;
	if((target.tagName || target.nodeName ).toLowerCase() == 'ul'){return;}
	while ((target.tagName || target.nodeName ).toLowerCase() != 'a'){
		target = target.parentNode;
	}
	var parent = target.parentNode;
	var tooltip = parent.getAttribute('data-tooltip');

	if(flag){
		flag = false;
		num = tooltips.indexOf(tooltip);
		scroll(num);
	}
	
	var len = lis.length;
	for(var i = 0; i<len; i++){
		lis[i].className= '';
	}
	lis[num].className= 'active';
	setTimeout(function(e){
		flag = true;
	},1000);
}

if(document.addEventListener){
	document.getElementById('pp-nav').addEventListener("click", navclick, false); 
}else{
	document.getElementById('pp-nav').onclick = navclick;
}
