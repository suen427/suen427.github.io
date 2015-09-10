function banner(){
	/**
	 * 切换轮播图
	 * 
	 * @param {number} num 要切换到的轮播图片的索引
	 * @param {number} current 当前显示的轮播图的索引
	 */
	function playNum(num,current){
		imgs[num].setAttribute('class','item display');
		lis[num].className='carousel selected';
		for(var i=0;i<num;i++){
			imgs[i].setAttribute('class','item left');
			lis[i].className='carousel';
		}
		for(var i=len-1;i>num;i--){
			imgs[i].setAttribute('class','item right');
			lis[i].className='carousel';
		}
		imgs[current].className=num>current ? 'item left pre':'item right pre';
		time=new Date().getTime();
	}
	/**
	 * 判断如何切换轮播图
	 * 
	 */
	function play(){
		var divDisplay = banner.getElementsByClassName("display")[0];
		var current = Number(divDisplay.dataset.num);
		var num;
		if(circle){
			if(direction==1){
				num = current==len-1?0:current+1;
			}else if(direction==2){
				num = current==0?len-1:current-1;
			}
		}else{
			if(direction==1){
				if(current==len-1) {
					var e = document.createEvent("MouseEvents");
					e.initEvent("click", true, true);
					document.getElementById("btn2").dispatchEvent(e);
					return;
				}
				num = current+1;
			}else if(direction==2){
				if(current==0) {
					var e = document.createEvent("MouseEvents");
					e.initEvent("click", true, true);
					document.getElementById("btn2").dispatchEvent(e);
					return;
				}
				num = current-1;
			}
		}
		
		playNum(num,current);
		timerID=setTimeout(play,interval);
	}
	/**
	 * 切换轮顺序
	 *
	 */
	function changedir(){
		direction=direction==1?2:1;
	}
	/**
	 * 通过ul代理在小圆点（li）上注册图片切换事件
	 *
	 */
	function changeByClick(e){//不考虑兼容IE
		if(new Date().getTime()-time<1000){
			return;
		}
		var target = e.target;
		var divDisplay = banner.getElementsByClassName("display")[0];
		var current = Number(divDisplay.dataset.num);
		if(!(target instanceof HTMLLIElement)){
			return;
		}
		var num = target.dataset.num;
		clearTimeout(timerID);
		playNum(num,current);		
		timerID=state?setTimeout(play,interval):'';
	}
	/**
	 * 切换播放暂停
	 *
	 */
	 function changeState(e){
	 	var target = e.target;
	 	state=state==1?0:1;
	 	target.innerHTML=state?'暂停':'播放';
	 	state?(timerID=setTimeout(play,interval)):clearTimeout(timerID);
	 }
	 /**
	 * 切换循环
	 *
	 */
	 function changeCircle(event){
	 	var target = event.target;
	 	circle=circle==1?0:1;
	 	target.innerHTML=circle?'取消循环':'设置循环';
	 	if(circle && !state){
	 		e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			document.getElementById("btn2").dispatchEvent(e)
	 	}
	 }
	 /**
	 * 设置轮播间隔
	 *
	 */
	 function setIntervaTime(e){
	 	var t = document.getElementById("interval").value;
	 	t = parseInt(t);
	 	if(typeof t == 'number'){
	 		if(t<1000){
	 			alert('请输入间隔大于1秒！')
	 		}else{
	 			interval=t;
	 			var msg = document.getElementById('msg');
	 			msg.innerHTML='设置成功！';
	 			msg.style.color='red';
	 			setTimeout(function(){
	 				msg.innerHTML='';
	 			},800);
	 		}
	 	}else{
	 		alert('请输入正确的数字');
	 	}
	 }

	// 控制参数：
	var direction=1;	// 1表示正向，2表示反向
	var state=1;		// 0表示暂停，1表示播放
	var circle=1;		// 1表示循环播放，0表示不循环
	var interval=3000;	// 轮播间隔
	var time=new Date().getTime();			// 保证动画完成才能响应新的动作


	var banner = document.getElementsByClassName("banner")[0];
	var imgs = banner.getElementsByClassName('item');
	var ul= banner.getElementsByClassName('carousel')[0];
	for(var i=0,len=imgs.length;i<len;i++){
		var li = document.createElement('li');
		li.setAttribute('data-num',i);
		li.setAttribute('class','carousel');
		if(i==0){
			li.setAttribute('class','carousel selected');
		}
		ul.appendChild(li);
	}
	var lis=banner.getElementsByTagName('li');
	var btn1 = document.getElementById("btn1");
	btn1.addEventListener('click',changedir);
	ul.addEventListener('click',changeByClick);

	var btn2 = document.getElementById("btn2");
	btn2.addEventListener('click',changeState);

	var btn3 = document.getElementById("btn3");
	btn3.addEventListener('click',changeCircle);

	var btn4 = document.getElementById("btn4");
	btn4.addEventListener('click',setIntervaTime);

	var timerID=setTimeout(play,interval);
}
banner();