/*在和上一任务同一目录下面创建一个task0002_2.html文件，
在js目录中创建task0002_2.js，并在其中编码，
实现一个倒计时功能。

界面首先有一个文本输入框，允许按照特定的格式YYYY-MM-DD输入年月日；
输入框旁有一个按钮，点击按钮后，计算当前距离输入的日期的00:00:00有多少时间差
在页面中显示，距离YYYY年MM月DD日还有XX天XX小时XX分XX秒
每一秒钟更新倒计时上显示的数
如果时差为0，则倒计时停止*/

function btnHandler(e){
	var time=document.getElementById("in").value.trim();
	var p = document.getElementById('out');
	// 验证输入
	time=time.split('-');
	if(time[1]>12){
		p.innerHTML="请输入正确的日期！";
		clearTimeout(timerId);
		return;
	}else if (time[2]>31||
		((time[1]==4||
		time[1]==6||
		time[1]==9||
		time[1]==11)&&time[2]>30)
		||(time[1]==2&&time[2]>29)||
		(time[0]%4!=0&&time[1]==2&&time[2]>28)) {
		p.innerHTML="请输入正确的日期！";
		clearTimeout(timerId);
		return;
	}else if(time[0]<new Date().getFullYear()||(time[0]==new Date().getFullYear()&&
		time[1]-1<new Date().getMonth())||(time[0]==new Date().getFullYear()&&
		time[1]-1==new Date().getMonth()&&time[2]<=new Date().getDate())) {
		p.innerHTML="请输入时间大于当前日期！";
		clearTimeout(timerId);
		return;
	}

	var date=new Date(time[0].trim(),time[1].trim()-1,time[2].trim());
	function timer(){
		clearTimeout(timerId);
		var seconds=Math.floor((date.getTime()-new Date().getTime())/1000);
		var day=Math.floor(seconds/(60*60*24));
		var hour=Math.floor(seconds/(60*60))%24;
		var minute = Math.floor(seconds/60)%60;
		var second = seconds%60;
		p.innerHTML='距离'+time[0]+'年'+time[1]+'月'+time[2]+'日还有'+day+'天'+hour+'小时'+minute+'分'+second+'秒'
		timerId = setTimeout(timer,1000);
		if(day==0&&hour==0&&minute==0&&second==0){
			clearTimeout(timerId);
		}

	}
	// alert(day+':'+hour+':'+minute+':'+second);
	timer();
}
var timerId;
var btn = document.getElementById('btn');
btn.addEventListener("click",btnHandler,false);

function timer2(){
	var date = new Date('2016-1-15');
	var seconds=Math.floor((date.getTime()-new Date().getTime())/1000);
	var day=Math.floor(seconds/(60*60*24));
	var hour=Math.floor(seconds/(60*60))%24;
	var minute = Math.floor(seconds/60)%60;
	var second = seconds%60;
	var p = document.getElementById("out");
	p.innerHTML='距离2016年1月16日<b>毕业</b>还有'+day+'天'+hour+'小时'+minute+'分'+second+'秒'
	timerId = setTimeout(timer2,1000);
	if(day==0&&hour==0&&minute==0&&second==0){
		clearTimeout(timerId);
	}

}
// alert(day+':'+hour+':'+minute+':'+second);
timer2();