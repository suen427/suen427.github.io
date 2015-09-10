var main = document.getElementsByClassName('main')[0],
	container = document.getElementsByClassName('container'),
	container1 = container[0],
	container2 = container[1],
	ismoving = false,
	preClientX = 0,
	preClientY = 0,
	left = 0,
	Top = 0,
	scrollTop = 0,
	scrollLeft = 0;
main.addEventListener('mousedown',function (event) {
	var target = event.target;
	if(target.className.indexOf('container')>-1 || target===main) {
		target = main.getElementsByClassName('active')[0];
		if(!target) {return}
	}
	target.className = 'group active';
	target.style.cursor = 'move';
	ismoving = true;
	preClientX = event.clientX;
	preClientY = event.clientY;
	left = target.offsetLeft;
	Top = target.offsetTop;
	scrollTop = document.body.scrollTop;
	scrollLeft = document.body.scrollLeft
},false)

main.addEventListener('mouseup',function (event) {
	var target = event.target;
	if(target.className.indexOf('container')>-1 || target===main) {
		target = main.getElementsByClassName('active')[0];
		if(!target) {return}
	}
	hideTip();
	if(isCapture(target)){
		insert(target);
	}
	for(var i = 0; i < container.length; i++){
		var children = container[i].getElementsByTagName('div');
		for(var j=0; j < children.length; j++){
			target = children[j];
			target.className = 'group';
			target.style.left = '';
			target.style.top = '';
			target.style.cursor = '';
		}
	}
	ismoving = false;
},false)

main.addEventListener('mousemove',function (event) {
	var target = event.target;
	if(target.className.indexOf('container')>-1 || target===main) {
		target = main.getElementsByClassName('active')[0];
	}
	if(ismoving){
		target.style.left = left+(event.clientX-preClientX)+document.body.scrollLeft-scrollLeft+'px';
		target.style.top = Top+(event.clientY-preClientY)+document.body.scrollTop-scrollTop+'px';
		if(isCapture(target)){
			showTip(target);
		}else{
			hideTip();
		}
	}
},false)

/**
* 判断是否被捕获
*
*/
function isCapture(target){
	var parent = target.parentNode;
	var left = parseInt(target.style.left);
	var Top = parseInt(target.style.top);
	if (parent===container1){
		if(left>190 && left<310 && Top>-10 && Top<280){
			return true;
		}
	}else if(parent===container2){
		if(left<-190 && left>-310 && Top>-10 && Top<280){
			return true;
		}
	}
	return false;
}
/**
* 将元素放置到目标位置
*
*/
function insert(target){
	var parent = target.parentNode;
	var Top = parseInt(target.style.top);
	var num = Math.round(Top/31);
	if (parent===container1){
		parent.removeChild(target);
		var children = container2.getElementsByTagName('div');
		if(num >= children.length){
			container2.appendChild(target);
		}else{
			var refer = children[num];
			container2.insertBefore(target,refer);
		}
	}else if(parent===container2){
		parent.removeChild(target);
		var children = container1.getElementsByTagName('div');
		if(num >= children.length){
			container1.appendChild(target);
		}else{
			var refer = children[num];
			container1.insertBefore(target,refer);
		}
	}
}
function showTip(target){
	var left = parseInt(target.style.left);
	var Top = parseInt(target.style.top);
	var tip = document.getElementsByClassName('tip')[0];

	var copy = target.cloneNode(true);
	var num = Math.round(parseInt(target.style.top)/31);
	copy.style.opacity = '0.6';
	copy.backgroundColor = target.backgroundColor;
	copy.className = 'group copy';
	var copyexist = main.getElementsByClassName('copy')[0];
	if(target.parentNode===container1){
		tip.style.left = left+210+'px';
		tip.style.top = Top+50+'px';
		tip.className = 'tip';
		var children = container2.getElementsByTagName('div');
		if(num >= children.length){
			if(copyexist){
				container2.removeChild(copyexist);
			}
			container2.appendChild(copy);
		}else{
			if(copyexist){
				container2.removeChild(copyexist);
			}
			var refer = children[num];
			container2.insertBefore(copy,refer);
		}
	}else if(target.parentNode===container2){
		tip.style.left = left+460+'px';
		tip.style.top = Top+50+'px';
		tip.className = 'tip';
		var children = container1.getElementsByTagName('div');
		if(num >= children.length){
			if(copyexist){
				container1.removeChild(copyexist);
			}
			container1.appendChild(copy);
		}else{
			if(copyexist){
				container1.removeChild(copyexist);
			}
			var refer = children[num];
			container1.insertBefore(copy,refer);
		}
	}
}
function hideTip(){
	var tip = document.getElementsByClassName('tip')[0];
	tip.className = 'tip hidden';
	var copyexist = main.getElementsByClassName('copy')[0];
	if(copyexist){
		copyexist.parentNode.removeChild(copyexist);
	}
}