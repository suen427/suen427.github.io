/*
ie8 兼容问题
1） 不支持firstElementChild属性 527行
2） HTMLVideoElement元素及对应的play()方法。246行和501行
*/

(function(document){
	/**
	 * 兼容IE的类选择器getElementsByClassName
	 *
	 * @param {string} className 类名称
	 * @return {Array.<HTMLElement>} 返回匹配的元素列表
	 */
	function getElementsByClassName(className,context){
		var context = context || document;
		var result = [];
		if(context.getElementsByClassName){
			result = context.getElementsByClassName(className);
		}else{
			var temp = context.getElementsByTagName("*");
			for(var i = 0, len = temp.length; i < len; i++){
				var node = temp[i];
				if(hasClass(node, className)){
					result.push(node);
				}
			}
		}
		return result;
	}

	function hasClass(element, className){
		var classNames = element.className;
	    if (!classNames) {
	        return false;
	    }
	    classNames = classNames.split(/\s+/);
	    for (var i = 0, len = classNames.length; i < len; i++) {
	        if (classNames[i] === className) {
	            return true;
	        }
	    }
	    return false;
	}

	/**
	 * 注册事件
	 *
	 * @param {HTMLElement} element  注册事件的html元素
	 * @param {string} type  注册事件类型
	 * @param {Function} listener  事件处理函数
	 */
	function addEvent(element, type, listener){
		if (!!element.addEventListener){
			element.addEventListener(type, listener, false);
		}else if (element.attachEvent){
			element.attachEvent('on'+type, listener);
		}
	}

	function removeEvent(element, type, listener){
		if (!!element.removeEventListener){
			element.removeEventListener(type, listener, false);
		}else if (element.detachEvent){
			element.detachEvent('on'+type, listener);
		}
	}

	function setCookie (name, value, expires, path, domain, secure) {
		var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		if (expires){
			cookie += ';expires='+expires.toGMTString();
		}
		if (path){
			cookie += ';path='+path;
		}
		if (domain){
			cookie += ';domain='+domain;
		}
		if (secure){
			cookie += ';secure='+secure;
		}
		document.cookie = cookie;
	}

	function getCookie(){
		var cookie = {};
		var all = document.cookie;
		if (all === ''){
			return cookie;
		}
		var list = all.split("; ");
		for (var i = 0; i < list.length; i++){
			var item = list[i];
			var p = item.indexOf('=');
			var name = item.substring(0,p);
			name = decodeURIComponent(name);
			var value = item.substring(p+1);
			value = decodeURIComponent(value);
			cookie[name] = value;
		}
		return cookie;
	}

	function removeCookie(name, path, domain) {
		document.cookie = name + '=' 
			+ '; path=' + path 
			+ '; domian=' + domain 
			+ '; max-age=0';
	}

	
	var settings = {
		follow: false,
	}
	var cookie = getCookie();
	/*顶部通知栏操作*/
	var cookie = getCookie();
	if (cookie.notification === 'false' ){
		getElementsByClassName("header")[0].remove()/*style.display = 'none'*/;
	}else{
		getElementsByClassName("message")[0].innerHTML = '<div class="left">'
			+'网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！ '
			+'<a href="#">立即查看&gt;</a></div>'
			+'<div class="closed"><span id="close">X</span> 不再提醒</div>';
		addEvent(document.getElementById('close'), 'click', function(event){
			var event = event || window.event;
			var target = event.target ||event.srcElement;
			target.parentNode.parentNode.style.display = 'none';
			setCookie('notification','false');
		});
		getElementsByClassName("header")[0].style.backgroundColor = '#f3f3f3';
	}
		

	/*关注登录操作*/
	//关注
	if(cookie.followSuc){
		//关注
		follow();
	}else{
		//取消关注
		unfollow();
		addEvent(document.getElementById('follow'), 'click', followHandle);
	}

	function follow() {
		var url = 'http://study.163.com/webDev/attention.htm'
		var xhr = new XMLHttpRequest();
		xhr.open('get', url);
		xhr.send();
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 && xhr.responseText == '1' ){
				removeEvent( document.getElementById('follow'), 'click', followHandle);
				document.getElementById("follow").outerHTML = "<span id='follow' class='followed'>&radic; 已关注 | <a id='unfollow'>取消</a><\/span>";
				addEvent(document.getElementById('unfollow'), 'click', unfollowHandle);
				setCookie('followSuc', 'true');
			}
		}
	}
	function unfollow(){		
		document.getElementById("follow").outerHTML = "<span id='follow'>+关注</span>";
		removeCookie('followSuc', '', '');
	}
	function followHandle(event) {
		var event = event || window.event;
		var target = event.target ||event.srcElement;
		cookie = getCookie();
		if (cookie.loginSuc){
			follow();
		}else{
			getElementsByClassName("login-back")[0].style.display = "block";
			settings.follow = true;
		}
	}
	function unfollowHandle(event) {
		var event = event || window.event;
		var target = event.target ||event.srcElement;
		removeEvent( target, 'click', unfollowHandle);
		unfollow();
		addEvent(document.getElementById('follow'), 'click', followHandle);
		removeCookie('followSuc', '', '');
	}
	
	//登录
	addEvent(document.getElementById('submit'), 'click', function(event) {
		var event = event || window.event;
		var target = event.target ||event.srcElement;

		//阻止默认事件
		if (event.preventDefault){
			event.preventDefault();
		}else {
			event.returnValue = false;
		}

		var form = target.parentNode;
		var url = 'http://study.163.com/webDev/login.htm?'
		var xhr = new XMLHttpRequest();
		url += encodeURIComponent(form.userName.name)+'='+encodeURIComponent(md5(form.userName.value))+"&";
		url += encodeURIComponent(form.password.name)+'='+encodeURIComponent(md5(form.password.value));
		xhr.open('get', url);
		xhr.send();
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4) {
				if(xhr.responseText == '1'){
					setCookie('loginSuc', 'true');
					getElementsByClassName("login-back")[0].style.display = "none";
					if (settings.follow === true){
						follow();
					}
				} else if ( xhr.responseText == '0' ) {
					var message = document.createElement('div');
					message.className = 'error';
					message.innerHTML = '输入的用户名或密码有误!';
					getElementsByClassName("login")[0].appendChild(message);
					setTimeout(function(){
						getElementsByClassName("login")[0].removeChild(message);
					},3000);
				}
			}
		}
		/*xhr.onload = function(){
			if(xhr.responseText == '1'){
				setCookie('loginSuc', 'true');
				getElementsByClassName("login-back")[0].style.display = "none";
				if (settings.follow === true){
					follow();
				}
			}
		}
		xhr.onerror = function() {
			if ( xhr.responseText == '0' ) {
				var message = document.createElement('div');
				message.className = 'error';
				message.innerHTML = '输入的用户名或密码有误';
				getElementsByClassName("login")[0].appendChild(message);
			}
		}*/
	})
	// 关闭界面
	addEvent(document, 'click', function(event) {
		var event = event || window.event;
		var target = event.target ||event.srcElement;
		if( hasClass(target, 'close') ){
			target.parentNode.parentNode.style.display = "none";
			if ( target.previousElementSibling instanceof HTMLVideoElement){
				target.previousElementSibling.pause();
			}
		}
	})

	//轮播图
	function roll(next){
		var current = getElementsByClassName('selected')[0];
		var num = current.className;
		num = num.substr(num.indexOf('carousel-')+9, 1);
		num = Number(num);
		if (num ===next ){
			return;
		}
		if (next === undefined){
			if ( num === 3 ){
				var next = 1;
			}else {
				var next = num + 1;
			}
		}
		
		nextImg = getElementsByClassName('carousel-'+next)[0];
		current.className = 'carousel-' + num;
		nextImg.className = 'carousel-' + next + ' selected';
		var pointers = getElementsByClassName('pointer')[0];
		pointers = pointers.getElementsByTagName('span');
		for ( var i = 0, len = pointers.length; i < len; i++ ) {
			pointers[i].className = '';
		}
		pointers[next-1].className = 'selected';
		nextImg.style.opacity = 0.05;
		function fadeIn() {
			var opacity = Number(nextImg.style.opacity);
			nextImg.style.opacity = opacity+0.05;
			if (nextImg.style.opacity >= 1){
				nextImg.style.opacity = 1;
			}else{
				setTimeout(fadeIn, 25);
			}
		}
		fadeIn();
	}

	settings.intervalId = setInterval(roll, 5000);
	//指示器切换轮播图
	var pointers = getElementsByClassName('pointer')[0];
	addEvent( pointers, 'click', function(event) {
		var event = event || window.event;
		var target = event.target ||event.srcElement;
		if (target instanceof HTMLSpanElement) {
			var next = target.getAttribute('num');
			next = Number(next);
			clearInterval(settings.intervalId);
			roll(next);
			if ( !settings.pause ){
				settings.intervalId = setInterval(roll, 5000);
			}
		}
	})

	//鼠标悬停图片停止切换轮播图片
	var carousel = getElementsByClassName('carousel')[0];
	addEvent(carousel, 'mouseenter', function (event) {
		clearInterval(settings.intervalId);
		settings.pause = true;
	})
	addEvent(carousel, 'mouseleave', function (event) {
		settings.intervalId = setInterval(roll, 5000);
	})

	//tab获取课程列表
	var tabs = getElementsByClassName('tabs')[0];
	addEvent( tabs, 'click', function (event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var type = target.id;
		if (type === "forDesign"){
			type = 10;
		}else if (type === "forProgramma") {
			type = 20;
		}else {
			return;
		}
		getCourse( 1, 20, type );
	})

	function getCourse (pageNo, psize, type) {
		var url = 'http://study.163.com/webDev/couresByCategory.htm?'
		var xhr = new XMLHttpRequest();
		url += encodeURIComponent( 'pageNo' )+'='+encodeURIComponent( pageNo )+"&";
		url += encodeURIComponent( 'psize' )+'='+encodeURIComponent( psize )+"&";
		url += encodeURIComponent( 'type' )+'='+encodeURIComponent( type );
		xhr.open('get', url);
		xhr.send();
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && xhr.status == 200 ) {
				var result = JSON.parse( xhr.responseText );
				var list = result.list,
					totalPage = result.totalPage,
					totalCount = result.totalCount,
					pageIndex = result.pagination.pageIndex,
					pageSize = result.pagination.pageSize,
					totlePageCount = result.pagination.totlePageCount;
				settings.totalPage = totalPage;
				settings.currentPage = pageIndex;
				settings.result = result;
				var courselist = document.getElementById('courselist');
				courselist.innerHTML = "";
				var ul = document.createElement('ul');
				ul.className = 'row';
				for ( var i = 0, len = list.length; i < len; i++ ) {
					var li = document.createElement('li');
					var price = list[i].price == 0 ? "免费" : "￥"+list[i].price;
					li.className = 'shadow-1';
					li.setAttribute('num', i);
					li.innerHTML = '<img src="' + list[i].middlePhotoUrl + '">'
						+ '<p class="ellipsis title">' + list[i].name + '</p>'
						+ '<p class="tag">' + list[i].provider + '</p>'
						+ '<p class="follow"><img src="img/tag.png"> ' + list[i].learnerCount + '</p>'
						+ '<p class="price">' + price + '</p>';
					ul.appendChild(li);
				}
				courselist.appendChild(ul);
				settings.type = type;
				setPages();

				//添加课程卡片悬停效果事件
				var courselist = document.getElementById('courselist');
				var lis = courselist.getElementsByTagName('li');
				for (var i = 0, len = lis.length; i < len; i++){
					addEvent( lis[i], 'mouseenter', couresEnterHandler );
					addEvent( lis[i], 'mouseleave', couresLeaveHandler );
				}
			}
				
		}
	}

	//点击页码更新课程列表
	var pages = getElementsByClassName('pages')[0];
	addEvent( pages, 'click', function (event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		if ( target instanceof HTMLLIElement ) {
			var current = getElementsByClassName('active', pages)[0];
			var currentPage = Number(current.innerHTML);

			if ( target.title === '上一页' && currentPage > 1 ) {
				var page = currentPage-1;
			}else if ( target.title === '下一页' && currentPage < settings.totalPage ) {
				var page = currentPage+1;
			}else {
				var page = Number(target.innerHTML);
			}
			if ( page > 0 && page < settings.totalPage ){
				getCourse( page, 20, settings.type );
			}
		}
	})

	//设置页码
	function setPages() {
		var pages = getElementsByClassName('pages')[0];
		pages.innerHTML = '<li title="上一页">&lt;</li>';
		if ( settings.totalPage < 9 ){
			for (var i = 1; i < settings.totalPage; i++) {
				if ( settings.currentPage == i ){
					pages.innerHTML += '<li class="active">' + i + '</li>';
				} else {
					pages.innerHTML += '<li>' + i + '</li>';
				}
			}
		} else {
			if ( settings.currentPage < 6) {
				for (var i = 1; i < 7; i++) {
					if ( settings.currentPage == i ){
						pages.innerHTML += '<li class="active">' + i + '</li>';
					} else {
						pages.innerHTML += '<li>' + i + '</li>';
					}
				}
				pages.innerHTML += '<li>...</li><li>' + settings.totalPage + '</li>';
			} else if (settings.currentPage > settings.totalPage-5){
				pages.innerHTML += '<li>1</li><li>...</li>';
				for (var i = settings.currentPage-6; i <= settings.currentPage-7; i++) {
					if ( settings.currentPage == i ){
						pages.innerHTML += '<li class="active">' + i + '</li>';
					} else {
						pages.innerHTML += '<li>' + i + '</li>';
					}
				}
			} else {
				pages.innerHTML += '<li>1</li><li>...</li>';
				pages.innerHTML += '<li>' + (settings.currentPage-2) + '</li>'
					+ '<li>' + (settings.currentPage-1) + '</li>'
					+ '<li>' + ettings.currentPage + '</li>'
					+ '<li>' + (settings.currentPage+1) + '</li>'
					+ '<li>' + (settings.currentPage+2) + '</li>';
				pages.innerHTML += '<li>...</li><li>' + settings.totalPage + '</li>';
			}
		}
		pages.innerHTML += '<li title="下一页">&gt;</li>';
	}

	//鼠标悬停课程卡片事件处理函数
	function couresEnterHandler (event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		settings.hoverId = setTimeout(function(){
			var detail = document.createElement('div');
			var num = Number(target.getAttribute('num'));
			var info = settings.result.list[num];
			detail.className = 'details';
			detail.id = 'details';
			detail.innerHTML = 
				'<div>'
					+'<img src="'+info.middlePhotoUrl+'">'
					+'<div class="detail">'
						+'<h3>'+ info.name +'</h3>'
						+'<p class="learners"><img src="img/tag.png"> '+info.learnerCount+'人在学</p>'
						+'<p class="provider">发布者：'+info.provider+'</p>'
						+'<p class="category">分类：'+info.categoryName+'</p>'
					+'</div>'
				+'</div>'
				+'<p class="descreption">'+ info.description +'</p>';
			target.appendChild(detail);
		}, 800);
	}

	function couresLeaveHandler (event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		clearTimeout(settings.hoverId);
		var detail = getElementsByClassName('details')[0];
		if ( detail != undefined ){
			target.removeChild(detail);
		}
	}

	//视频播放
	var intro = document.getElementById('introduction');
	addEvent( intro, 'click', function (event) {
		getElementsByClassName('player-back')[0].style.display = 'block';
		document.getElementById('introVideo').play();
	})

	//最热排行
	function setHotTop() {
		var url = 'http://study.163.com/webDev/hotcouresByCategory.htm'
		var xhr = new XMLHttpRequest();
		xhr.open('get', url);
		xhr.send();
		xhr.onreadystatechange = function(){
			if ( xhr.readyState == 4 && xhr.status == 200 ) {
				var result = JSON.parse(xhr.responseText);
				var hottop = getElementsByClassName('hottop')[0];
				hottop.innerHTML = '';
				for (var i = 0, len = 10; i < len; i++){
					var hot = document.createElement('div');
					hot.className = 'hot';
					hot.innerHTML = '<img src="' + result[i].smallPhotoUrl + '">'
									+'<p class="ellipsis">'+ result[i].name +'</p>'
									+'<p class="tag"><img src="img/tag.png"> '+ result[i].learnerCount +'</p>';
					hottop.appendChild(hot);
				}
				function hottopLoop () {
					var firstChild = hottop.firstElementChild;
					// hottop.removeChild( hottop.firstElementChild );
					var hot = document.createElement('div');
					hot.className = 'hot';
					hot.innerHTML = '<img src="' + result[i].smallPhotoUrl + '">'
									+'<p class="ellipsis">'+ result[i].name +'</p>'
									+'<p class="tag"><img src="img/tag.png"> '+ result[i].learnerCount +'</p>';
					hottop.appendChild(hot);
					i++;
					if ( i === 20 ) {
						i = 0;
					}
					function animation () {
						var marginTop = parseInt(firstChild.style.marginTop) || 0;
						firstChild.style.marginTop = marginTop - 7 +'px';
						if ( marginTop - 7 <-70 ){
							firstChild.style.marginTop = -70 +'px';
							hottop.removeChild(firstChild);
						}else {
							setTimeout( animation, 30 );
						}
					}
					animation();
					setTimeout(hottopLoop, 5000);
				}
				setTimeout(hottopLoop, 5000);
			}
				
		}
	}

	getCourse( 1, 20, 10 );
	setHotTop();


})(document);