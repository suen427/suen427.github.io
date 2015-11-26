var preSet = [new Array(31),new Array(31),new Array(31),new Array(31),new Array(31)];


function createSchedule2(){
	var week = nextMonth.getDay(); //一个月的第一天是哪个星期
	var weeks = Math.floor((daysNumOfMonth+week-2)/7);//一个月的连续双休日个数
	var firstSat = 6-week;//第一个周六是一个月中的哪一天，第一天为0
	var totalDoubleDay=2*weeks;//所有人双休个数之和
	var names = ['戎超群','吴艳','吴丹丹','叶佳莹','张智'];

	var p1 = new imployee(daysNumOfMonth, weeks);
	var p2 = new imployee(daysNumOfMonth, weeks);
	var p3 = new imployee(daysNumOfMonth, weeks);
	var p4 = new imployee(daysNumOfMonth, weeks);
	var p5 = new imployee(daysNumOfMonth, weeks);

	function include(n,i){
		if(p1.workTable[i]===n){return true}
		if(p2.workTable[i]===n){return true}
		if(p3.workTable[i]===n){return true}
		if(p4.workTable[i]===n){return true}
		if(p5.workTable[i]===n){return true}
		return false;
	}


	//预先设置某人哪天休息
	// p1.workTable[0]=p1.workTable[1]=4;
	// p1.workTable[5]=p1.workTable[6]=4;
	

	setpreSet(preSet, p1, 0);
	setpreSet(preSet, p2, 1);
	setpreSet(preSet, p3, 2);
	setpreSet(preSet, p4, 3);
	setpreSet(preSet, p5, 4);

	//设置星期二大家都上班
	var firstTue = 9-week;//第一個星期二是一個月的哪天
	if (firstTue>6){
		firstTue = firstTue-7;
	}
	//财务
	for(var i=firstTue; i<daysNumOfMonth; i=i+7){
		var list = [];
		if(include(1,i)){continue}
		addImployee2List(p1, list, i);
		addImployee2List(p2, list, i);
		addImployee2List(p3, list, i);
		addImployee2List(p4, list, i);
		addImployee2List(p5, list, i);
		var r=Math.floor(Math.random()*60)%list.length;
		var p = list[r];//班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息//岗4、岗1、岗2、岗3，休
		if(p.finance<6){//班表状态4中：0,1,2,3,4       //岗4、  岗1、  岗2、 岗3， 休
			p.workTable[i]=1;p.finance=p.finance+1;//     0,    1,     2,    3,     4
		}else{
			r=(r+1)%list.length;
			p = list[r];
			if(p.finance<6){
				p.workTable[i]=1;p.finance=p.finance+1;
			}else{
				r=(r+1)%list.length;
				p = list[r];
				if(p.finance<6){
					p.workTable[i]=1;p.finance=p.finance+1;
				}else{
					r=(r+1)%list.length;
					p = list[r];
					p.workTable[i]=1;p.finance=p.finance+1;
				}
			}
		}
	}
	//接待
	for(var i=firstTue; i<daysNumOfMonth; i=i+7){
		if(include(2,i)){continue}
		list = [];
		addImployee2List(p1, list, i);
		addImployee2List(p2, list, i);
		addImployee2List(p3, list, i);
		addImployee2List(p4, list, i);
		addImployee2List(p5, list, i);
		var r=Math.floor(Math.random()*60)%list.length;
		var p = list[r];//班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息
		if(p.receptionist<6){
			p.workTable[i]=2;p.receptionist=p.receptionist+1;
		}else{
			r=(r+1)%list.length;
			p = list[r];
			if(p.receptionist<6){
				p.workTable[i]=2;p.receptionist=p.receptionist+1;
			}else{
				r=(r+1)%list.length;
				p = list[r];
				if(p.receptionist<6){
					p.workTable[i]=2;p.receptionist=p.receptionist+1;
				}else{
					r=(r+1)%list.length;
					p = list[r];
					p.workTable[i]=2;p.receptionist=p.receptionist+1;
				}
			}
		}
	}
	//支援岗
	for(var i=firstTue; i<daysNumOfMonth; i=i+7){
		if(include(3,i)){continue}
		list = [];
		addImployee2List(p1, list, i);
		addImployee2List(p2, list, i);
		addImployee2List(p3, list, i);
		addImployee2List(p4, list, i);
		addImployee2List(p5, list, i);
		if(list.length==0) continue;
		var r=Math.floor(Math.random()*60)%list.length;
		var p = list[r];//班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息
		if(p.support<6){
			p.workTable[i]=3;p.support=p.support+1;
		}else{
			r=(r+1)%list.length;
			p = list[r];
			if(p.support<6){
				p.workTable[i]=3;p.support=p.support+1;
			}else{
				r=(r+1)%list.length;
				p = list[r];
				if(p.support<6){
					p.workTable[i]=3;p.support=p.support+1;
				}else{
					r=(r+1)%list.length;
					p = list[r];
					p.workTable[i]=3;p.support=p.support+1;
				}
			}
		}
	}

	//求连休两日的次数
	doubleDay(p1);
	doubleDay(p2);
	doubleDay(p3);
	doubleDay(p4);
	doubleDay(p5);

	//求周末双休的情况
	doubleWeekend(p1,firstSat);
	doubleWeekend(p2,firstSat);
	doubleWeekend(p3,firstSat);
	doubleWeekend(p4,firstSat);
	doubleWeekend(p5,firstSat);

	//设置周末放假
	if(totalDoubleDay<10){
		arrange(daysNumOfMonth, weeks, firstSat, p1, p2, p3, p4, p5,16);
	}else{
		arrange(daysNumOfMonth, weeks, firstSat, p1, p2, p3, p4, p5,25);
	}

	//求休息的天数
	p1.rest=sum(p1.workTable);
	p2.rest=sum(p2.workTable);
	p3.rest=sum(p3.workTable);
	p4.rest=sum(p4.workTable);
	p5.rest=sum(p5.workTable);

	//求连休两日的次数
	doubleDay(p1);
	doubleDay(p2);
	doubleDay(p3);
	doubleDay(p4);
	doubleDay(p5);

	//随机产生剩余的休息日
	setRestDay(daysNumOfMonth, totalReat, p1, p2, p3, p4, p5,firstTue);
	p1.rest=sum(p1.workTable);
	p2.rest=sum(p2.workTable);
	p3.rest=sum(p3.workTable);
	p4.rest=sum(p4.workTable);
	p5.rest=sum(p5.workTable);

	//将休息日补齐
	insertRest(daysNumOfMonth, totalReat, p1, p2, p3, p4, p5,firstTue);
	insertRest(daysNumOfMonth, totalReat, p2, p1, p3, p4, p5,firstTue);
	insertRest(daysNumOfMonth, totalReat, p3, p2, p1, p4, p5,firstTue);
	insertRest(daysNumOfMonth, totalReat, p4, p2, p3, p1, p5,firstTue);
	insertRest(daysNumOfMonth, totalReat, p5, p2, p3, p4, p1,firstTue);
	//求休息的天数
	p1.rest=sum(p1.workTable);
	p2.rest=sum(p2.workTable);
	p3.rest=sum(p3.workTable);
	p4.rest=sum(p4.workTable);
	p5.rest=sum(p5.workTable);

	//求连休两日的次数
	doubleDay(p1);
	doubleDay(p2);
	doubleDay(p3);
	doubleDay(p4);
	doubleDay(p5);
	doubleWeekend(p1,firstSat);
	doubleWeekend(p2,firstSat);
	doubleWeekend(p3,firstSat);
	doubleWeekend(p4,firstSat);
	doubleWeekend(p5,firstSat);


	//排财务、接待、支援的岗位,,设置3个数组分别放置每个岗位的员工
	//财务
	for(var i=0; i<daysNumOfMonth; i++){
		if(i%7==firstTue) continue;
		if(include(1,i)){continue}
		list = [];
		addImployee2List(p1, list, i);
		addImployee2List(p2, list, i);
		addImployee2List(p3, list, i);
		addImployee2List(p4, list, i);
		addImployee2List(p5, list, i);

		var r=Math.floor(Math.random()*60)%list.length;
		var p = list[r];//班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息
		if(p.finance<6){
			p.workTable[i]=1;p.finance=p.finance+1;
		}else{
			r=(r+1)%list.length;
			p = list[r];
			if(p.finance<6){
				p.workTable[i]=1;p.finance=p.finance+1;
			}else{
				r=(r+1)%list.length;
				p = list[r];
				if(p.finance<6){
					p.workTable[i]=1;p.finance=p.finance+1;
				}else{
					r=(r+1)%list.length;
					p = list[r];
					p.workTable[i]=1;p.finance=p.finance+1;
				}
			}
		}
	}
	//接待
	for(var i=0; i<daysNumOfMonth; i++){
		if(i%7==firstTue) continue;
		if(include(2,i)){continue}
		list = [];
		addImployee2List(p1, list, i);
		addImployee2List(p2, list, i);
		addImployee2List(p3, list, i);
		addImployee2List(p4, list, i);
		addImployee2List(p5, list, i);
		if(list.length==0) continue;
		var r=Math.floor(Math.random()*60)%list.length;
		var p = list[r];//班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息
		if(p.receptionist<6){
			p.workTable[i]=2;p.receptionist=p.receptionist+1;
		}else{
			r=(r+1)%list.length;
			p = list[r];
			if(p.receptionist<6){
				p.workTable[i]=2;p.receptionist=p.receptionist+1;
			}else{
				r=(r+1)%list.length;
				p = list[r];
				if(p.receptionist<6){
					p.workTable[i]=2;p.receptionist=p.receptionist+1;
				}else{
					r=(r+1)%list.length;
					p = list[r];
					p.workTable[i]=2;p.receptionist=p.receptionist+1;
				}
			}
		}
	}
	//支援岗
	for(var i=0; i<daysNumOfMonth; i++){
		if(i%7==firstTue) continue;
		if(include(3,i)){continue}
		list = [];
		addImployee2List(p1, list, i);
		addImployee2List(p2, list, i);
		addImployee2List(p3, list, i);
		addImployee2List(p4, list, i);
		addImployee2List(p5, list, i);
		if(list.length==0) continue;
		var r=Math.floor(Math.random()*60)%list.length;
		var p = list[r];//班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息
		if(p.support<6){
			p.workTable[i]=3;p.support=p.support+1;
		}else{
			r=(r+1)%list.length;
			p = list[r];
			if(p.support<6){
				p.workTable[i]=3;p.support=p.support+1;
			}else{
				r=(r+1)%list.length;
				p = list[r];
				if(p.support<6){
					p.workTable[i]=3;p.support=p.support+1;
				}else{
					r=(r+1)%list.length;
					p = list[r];
					p.workTable[i]=3;p.support=p.support+1;
				}
			}
		}
	}

	//验证周二有无休息日
	// for(var i=firstTue; i<daysNumOfMonth; i=i+7){
	// 	if(p1.workTable[i]==4||p2.workTable[i]==4||p3.workTable[i]==4||p4.workTable[i]==4||p5.workTable[i]==4){
	// 		alert(i+":::周二出现休息日");
	// 	}
	// }

	//周末休息天数
	restweekendday(p1,firstSat);
	restweekendday(p2,firstSat);
	restweekendday(p3,firstSat);
	restweekendday(p4,firstSat);
	restweekendday(p5,firstSat);

	var result = [];
	result[0] = p1.workTable;
	result[1] = p2.workTable;
	result[2] = p3.workTable;
	result[3] = p4.workTable;
	result[4] = p5.workTable;

	for (var i = 0; i<result.length; i++){
		switchResult(result[i]);
	}

	return result;
}


//tools 工具
	function imployee(daysNumOfMonth, weeks) {
		this.totalDoubleDay=0;
		/*
		 每个人的排班数组workTable
		 班表状态4中：0,1,2,3,4分别表示自由岗、财务、接待、支援、休息
		 每日必须包含1,2,3这三个岗位，且每人每月各岗位数尽量一致
		 休息日尽量安排在周末
		 每个人每个岗位的个数：freeWork、finance、receptionist、support、rest
		 每个人的双休个数doubleDay
		 */
		this.freeWork=0;
		this.finance=0;
		this.receptionist=0;
		this.support=0;
		this.rest=0;
		this.doubleDay=0;
		this.doubleWeekend=0;//记录有几个周末双休
		this.restWeekend=0;//记录周末休息的天数
		this.workTable = new Array(daysNumOfMonth);
		this.weekend = new Array(weeks);

		for (var i = 0; i<daysNumOfMonth; i++){
			this.workTable[i] = 0;
		}
		for (var i = 0; i<weeks; i++){
			this.weekend[i] = 0;
		}
		
	}

	function setpreSet(preSet, p1, i) {
		for(var j=0; j<daysNumOfMonth; j++){
			if(preSet[i][j] != undefined ){
				p1.workTable[j]=preSet[i][j];
			}
		}
	}

	function addImployee2List(p1, list, i) {
		if(p1.workTable[i]===0 || p1.workTable[i]===undefined){
			list[list.length] = p1;
		}
	}

	function doubleDay(p){
		var m = p.workTable.length;
		p.doubleDay=0;
		for(var i=0; i<m-1;i++){
			if(p.workTable[i]==4&&p.workTable[i+1]==4){
				p.doubleDay=p.doubleDay+1;
			}
		}
	}

	function doubleWeekend(p, firstTue){
		var j=0;
		p.doubleWeekend=0;
		for(var i=firstTue;i<p.workTable.length-1;i=i+7){
			if(p.workTable[i]==4&&p.workTable[i+1]==4){
				p.doubleWeekend=p.doubleWeekend+1;
				p.weekend[j]=1;
			}
			j=j+1;
		}
	}

	function arrange(daysNumOfMonth, weeks, firstTue, p1, p2, p3, p4, p5, thr){
		function Rand() {};

		Rand.prototype.nextInt = function(n) {
		    return Math.round(Math.random()*n);
		};

		var rand = new Rand();

		for(var i = 0; i<weeks; i++){
			if(p1.weekend[i]!=1&&(p2.weekend[i]+p3.weekend[i]+p4.weekend[i]+p5.weekend[i])<2&&rand.nextInt(40)<thr
					&&p1.doubleDay<3&&p1.doubleWeekend<2&&p2.workTable[firstTue+7*i]+p3.workTable[firstTue+7*i]+
					p4.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p2.workTable[firstTue+1+7*i]+
					p3.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
				if((firstTue+7*i)==0&&p1.workTable[firstTue+7*i+2]!=4 && p1.workTable[firstTue+7*i]==0 && p1.workTable[firstTue+7*i+1]==0){
					p1.weekend[i]=1;
					p1.workTable[firstTue+7*i]=p1.workTable[firstTue+1+7*i]=4;
				}
				if((firstTue+7*i)==daysNumOfMonth-2&&p1.workTable[firstTue+7*i-1]!=4 && p1.workTable[firstTue+7*i]==0 && p1.workTable[firstTue+7*i+1]==0){
					p1.weekend[i]=1;
					p1.workTable[firstTue+7*i]=p1.workTable[firstTue+1+7*i]=4;
				}
				if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p1.workTable[firstTue+7*i+2]!=4
						&&p1.workTable[firstTue+7*i-1]!=4 && p1.workTable[firstTue+7*i]==0 && p1.workTable[firstTue+7*i+1]==0){
					p1.weekend[i]=1;
					p1.workTable[firstTue+7*i]=p1.workTable[firstTue+1+7*i]=4;
				}
				doubleDay(p1);
				doubleWeekend(p1,firstTue);
			}else{
				if(p2.doubleWeekend+p3.doubleWeekend+p4.doubleWeekend+p5.doubleWeekend>thr/3&&
						p1.doubleWeekend<2&&rand.nextInt(6)<4&&
						(p2.weekend[i]+p3.weekend[i]+p4.weekend[i]+p5.weekend[i])<2
						&&p2.workTable[firstTue+7*i]+p3.workTable[firstTue+7*i]+
						p4.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p2.workTable[firstTue+1+7*i]+
						p3.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
					if((firstTue+7*i)==0&&p1.workTable[firstTue+7*i+2]!=4 && p1.workTable[firstTue+7*i]==0 && p1.workTable[firstTue+7*i+1]==0){
						p1.weekend[i]=1;
						p1.workTable[firstTue+7*i]=p1.workTable[firstTue+1+7*i]=4;
					}
					if((firstTue+7*i)==daysNumOfMonth-2&&p1.workTable[firstTue+7*i-1]!=4 && p1.workTable[firstTue+7*i]==0 && p1.workTable[firstTue+7*i+1]==0){
						p1.weekend[i]=1;
						p1.workTable[firstTue+7*i]=p1.workTable[firstTue+1+7*i]=4;
					}
					if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p1.workTable[firstTue+7*i+2]!=4
							&&p1.workTable[firstTue+7*i-1]!=4 && p1.workTable[firstTue+7*i]==0 && p1.workTable[firstTue+7*i+1]==0){
						p1.weekend[i]=1;
						p1.workTable[firstTue+7*i]=p1.workTable[firstTue+1+7*i]=4;
					}
					doubleDay(p1);
					doubleWeekend(p1,firstTue);
				}
			}
			
			if(p2.weekend[i]!=1&&(p1.weekend[i]+p3.weekend[i]+p4.weekend[i]+p5.weekend[i])<2&&rand.nextInt(40)<thr
					&&p2.doubleDay<3&&p2.doubleWeekend<2&&p1.workTable[firstTue+7*i]+p3.workTable[firstTue+7*i]+
					p4.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
					p3.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
				if((firstTue+7*i)==0&&p2.workTable[firstTue+7*i+2]!=4 && p2.workTable[firstTue+7*i]==0 && p2.workTable[firstTue+7*i+1]==0){
					p2.weekend[i]=1;
					p2.workTable[firstTue+7*i]=p2.workTable[firstTue+1+7*i]=4;
				}
				if((firstTue+7*i)==daysNumOfMonth-2&&p2.workTable[firstTue+7*i-1]!=4 && p2.workTable[firstTue+7*i]==0 && p2.workTable[firstTue+7*i+1]==0){
					p2.weekend[i]=1;
					p2.workTable[firstTue+7*i]=p2.workTable[firstTue+1+7*i]=4;
				}
				if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p2.workTable[firstTue+7*i+2]!=4
						&&p2.workTable[firstTue+7*i-1]!=4 && p2.workTable[firstTue+7*i]==0 && p2.workTable[firstTue+7*i+1]==0){
					p2.weekend[i]=1;
					p2.workTable[firstTue+7*i]=p2.workTable[firstTue+1+7*i]=4;
				}
				doubleDay(p2);
				doubleWeekend(p2,firstTue);
			}else{
				if(p3.doubleWeekend+p4.doubleWeekend+p5.doubleWeekend>thr/4&&
						p2.doubleWeekend<2&&rand.nextInt(6)<4&&
						(p1.weekend[i]+p3.weekend[i]+p4.weekend[i]+p5.weekend[i])<2&&
						p1.workTable[firstTue+7*i]+p3.workTable[firstTue+7*i]+
						p4.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
						p3.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
					if((firstTue+7*i)==0&&p2.workTable[firstTue+7*i+2]!=4 && p2.workTable[firstTue+7*i]==0 && p2.workTable[firstTue+7*i+1]==0){
						p2.weekend[i]=1;
						p2.workTable[firstTue+7*i]=p2.workTable[firstTue+1+7*i]=4;
					}
					if((firstTue+7*i)==daysNumOfMonth-2&&p2.workTable[firstTue+7*i-1]!=4 && p2.workTable[firstTue+7*i]==0 && p2.workTable[firstTue+7*i+1]==0){
						p2.weekend[i]=1;
						p2.workTable[firstTue+7*i]=p2.workTable[firstTue+1+7*i]=4;
					}
					if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p2.workTable[firstTue+7*i+2]!=4
							&&p2.workTable[firstTue+7*i-1]!=4 && p2.workTable[firstTue+7*i]==0 && p2.workTable[firstTue+7*i+1]==0){
						p2.weekend[i]=1;
						p2.workTable[firstTue+7*i]=p2.workTable[firstTue+1+7*i]=4;
					}
					doubleDay(p2);
					doubleWeekend(p2,firstTue);
				}
			}
			
			if(p3.weekend[i]!=1&&(p1.weekend[i]+p2.weekend[i]+p4.weekend[i]+p5.weekend[i])<2&&rand.nextInt(40)<thr
					&&p3.doubleDay<3&&p3.doubleWeekend<2&&p1.workTable[firstTue+7*i]+p2.workTable[firstTue+7*i]+
					p4.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
					p2.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
				if((firstTue+7*i)==0&&p3.workTable[firstTue+7*i+2]!=4 && p3.workTable[firstTue+7*i]==0 && p3.workTable[firstTue+7*i+1]==0){
					p3.weekend[i]=1;
					p3.workTable[firstTue+7*i]=p3.workTable[firstTue+1+7*i]=4;
				}
				if((firstTue+7*i)==daysNumOfMonth-2&&p3.workTable[firstTue+7*i-1]!=4 && p3.workTable[firstTue+7*i]==0 && p3.workTable[firstTue+7*i+1]==0){
					p3.weekend[i]=1;
					p3.workTable[firstTue+7*i]=p3.workTable[firstTue+1+7*i]=4;
				}
				if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p3.workTable[firstTue+7*i+2]!=4
						&&p3.workTable[firstTue+7*i-1]!=4 && p3.workTable[firstTue+7*i]==0 && p3.workTable[firstTue+7*i+1]==0){
					p3.weekend[i]=1;
					p3.workTable[firstTue+7*i]=p3.workTable[firstTue+1+7*i]=4;
				}
				doubleDay(p3);
				doubleWeekend(p3,firstTue);
			}else{
				if(p4.doubleWeekend+p5.doubleWeekend>thr/5&&
						p3.doubleWeekend<2&&rand.nextInt(6)<4&&
						(p2.weekend[i]+p1.weekend[i]+p4.weekend[i]+p5.weekend[i])<2&&p1.workTable[firstTue+7*i]+p2.workTable[firstTue+7*i]+
						p4.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
						p2.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
					if((firstTue+7*i)==0&&p3.workTable[firstTue+7*i+2]!=4 && p3.workTable[firstTue+7*i]==0 && p3.workTable[firstTue+7*i+1]==0){
						p3.weekend[i]=1;
						p3.workTable[firstTue+7*i]=p3.workTable[firstTue+1+7*i]=4;
					}
					if((firstTue+7*i)==daysNumOfMonth-2&&p3.workTable[firstTue+7*i-1]!=4 && p3.workTable[firstTue+7*i]==0 && p3.workTable[firstTue+7*i+1]==0){
						p3.weekend[i]=1;
						p3.workTable[firstTue+7*i]=p3.workTable[firstTue+1+7*i]=4;
					}
					if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p3.workTable[firstTue+7*i+2]!=4
							&&p3.workTable[firstTue+7*i-1]!=4 && p3.workTable[firstTue+7*i]==0 && p3.workTable[firstTue+7*i+1]==0){
						p3.weekend[i]=1;
						p3.workTable[firstTue+7*i]=p3.workTable[firstTue+1+7*i]=4;
					}
					doubleDay(p3);
					doubleWeekend(p3,firstTue);
				}
			}
			
			if(p4.weekend[i]!=1&&(p1.weekend[i]+p2.weekend[i]+p3.weekend[i]+p5.weekend[i])<2&&rand.nextInt(40)<thr
					&&p4.doubleDay<3&&p4.doubleWeekend<2&&p1.workTable[firstTue+7*i]+p2.workTable[firstTue+7*i]+
					p3.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
					p2.workTable[firstTue+1+7*i]+p3.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
				if((firstTue+7*i)==0&&p4.workTable[firstTue+7*i+2]!=4 && p4.workTable[firstTue+7*i]==0 && p4.workTable[firstTue+7*i+1]==0){
					p4.weekend[i]=1;
					p4.workTable[firstTue+7*i]=p4.workTable[firstTue+1+7*i]=4;
				}
				if((firstTue+7*i)==daysNumOfMonth-2&&p4.workTable[firstTue+7*i-1]!=4 && p4.workTable[firstTue+7*i]==0 && p4.workTable[firstTue+7*i+1]==0){
					p4.weekend[i]=1;
					p4.workTable[firstTue+7*i]=p4.workTable[firstTue+1+7*i]=4;
				}
				if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p4.workTable[firstTue+7*i+2]!=4
						&&p4.workTable[firstTue+7*i-1]!=4 && p4.workTable[firstTue+7*i]==0 && p4.workTable[firstTue+7*i+1]==0){
					p4.weekend[i]=1;
					p4.workTable[firstTue+7*i]=p4.workTable[firstTue+1+7*i]=4;
				}
				doubleDay(p4);
				doubleWeekend(p4,firstTue);
			}else{
				if(p4.doubleWeekend<2&&(p1.weekend[i]+p2.weekend[i]+p3.weekend[i]+p5.weekend[i]==0||
						p5.doubleWeekend==2||rand.nextInt(5)<2)&&p4.doubleDay<3
						&&p1.weekend[i]+p2.weekend[i]+p3.weekend[i]+p5.weekend[i]<2&&p1.workTable[firstTue+7*i]+p2.workTable[firstTue+7*i]+
						p3.workTable[firstTue+7*i]+p5.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
						p2.workTable[firstTue+1+7*i]+p3.workTable[firstTue+1+7*i]+p5.workTable[firstTue+1+7*i]<8){
					if((firstTue+7*i)==0&&p4.workTable[firstTue+7*i+2]!=4 && p4.workTable[firstTue+7*i]==0 && p4.workTable[firstTue+7*i+1]==0){
						p4.weekend[i]=1;
						p4.workTable[firstTue+7*i]=p4.workTable[firstTue+1+7*i]=4;
					}
					if((firstTue+7*i)==daysNumOfMonth-2&&p4.workTable[firstTue+7*i-1]!=4 && p4.workTable[firstTue+7*i]==0 && p4.workTable[firstTue+7*i+1]==0){
						p4.weekend[i]=1;
						p4.workTable[firstTue+7*i]=p4.workTable[firstTue+1+7*i]=4;
					}
					if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p4.workTable[firstTue+7*i+2]!=4
							&&p4.workTable[firstTue+7*i-1]!=4 && p4.workTable[firstTue+7*i]==0 && p4.workTable[firstTue+7*i+1]==0){
						p4.weekend[i]=1;
						p4.workTable[firstTue+7*i]=p4.workTable[firstTue+1+7*i]=4;
					}
					doubleDay(p4);
					doubleWeekend(p4,firstTue);
				}
			}
			
			if(p5.weekend[i]!=1&&(p1.weekend[i]+p2.weekend[i]+p3.weekend[i]+p4.weekend[i])<2&&rand.nextInt(40)<thr
					&&p5.doubleDay<3&&p5.doubleWeekend<2&&p1.workTable[firstTue+7*i]+p2.workTable[firstTue+7*i]+
					p3.workTable[firstTue+7*i]+p4.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
					p2.workTable[firstTue+1+7*i]+p3.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]<8){
				if((firstTue+7*i)==0&&p5.workTable[firstTue+7*i+2]!=4 && p5.workTable[firstTue+7*i]==0 && p5.workTable[firstTue+7*i+1]==0){
					p5.weekend[i]=1;
					p5.workTable[firstTue+7*i]=p5.workTable[firstTue+1+7*i]=4;
				}
				if((firstTue+7*i)==daysNumOfMonth-2&&p5.workTable[firstTue+7*i-1]!=4 && p5.workTable[firstTue+7*i]==0 && p5.workTable[firstTue+7*i+1]==0){
					p5.weekend[i]=1;
					p5.workTable[firstTue+7*i]=p5.workTable[firstTue+1+7*i]=4;
				}
				if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p5.workTable[firstTue+7*i+2]!=4
						&&p5.workTable[firstTue+7*i-1]!=4 && p5.workTable[firstTue+7*i]==0 && p5.workTable[firstTue+7*i+1]==0){
					p5.weekend[i]=1;
					p5.workTable[firstTue+7*i]=p5.workTable[firstTue+1+7*i]=4;
				}
				doubleDay(p5);
				doubleWeekend(p5,firstTue);
			}else{
				if(p5.doubleWeekend<2&&(p1.weekend[i]+p2.weekend[i]+p3.weekend[i]+p4.weekend[i])<2
						&&p5.doubleDay<3&&p1.workTable[firstTue+7*i]+p2.workTable[firstTue+7*i]+
						p3.workTable[firstTue+7*i]+p4.workTable[firstTue+7*i]<8 && p1.workTable[firstTue+1+7*i]+
						p2.workTable[firstTue+1+7*i]+p3.workTable[firstTue+1+7*i]+p4.workTable[firstTue+1+7*i]<8){
					if((firstTue+7*i)==0&&p5.workTable[firstTue+7*i+2]!=4 && p5.workTable[firstTue+7*i]==0 && p5.workTable[firstTue+7*i+1]==0){
						p5.weekend[i]=1;
						p5.workTable[firstTue+7*i]=p5.workTable[firstTue+1+7*i]=4;
					}
					if((firstTue+7*i)==daysNumOfMonth-2&&p5.workTable[firstTue+7*i-1]!=4 && p5.workTable[firstTue+7*i]==0 && p5.workTable[firstTue+7*i+1]==0){
						p5.weekend[i]=1;
						p5.workTable[firstTue+7*i]=p5.workTable[firstTue+1+7*i]=4;
					}
					if(firstTue+7*i>0&&(firstTue+7*i)<daysNumOfMonth-2&&p5.workTable[firstTue+7*i+2]!=4
							&&p5.workTable[firstTue+7*i-1]!=4 && p5.workTable[firstTue+7*i]==0 && p5.workTable[firstTue+7*i+1]==0){
						p5.weekend[i]=1;
						p5.workTable[firstTue+7*i]=p5.workTable[firstTue+1+7*i]=4;
					}
					doubleDay(p5);
					doubleWeekend(p5,firstTue);
				}
			}
		}
	}

	function sum(workTable) {
		var sum =0;
		for(var i=0;i<workTable.length; i++){
			if(workTable[i]==4){sum=sum+1;}
		}
		return sum;
	}

	function setRestDay(daysNumOfMonth, totalReat, p1, p2, p3, p4, p5, firstTue){
		function Rand() {};

		Rand.prototype.nextInt = function(n) {
		    return Math.round(Math.random()*n);
		};
		var rand = new Rand();

		for(var i = 0; i<daysNumOfMonth; i++){
			if(i%7==firstTue) continue;
			var rest1=p1.rest, rest2=p2.rest, rest3=p3.rest, rest4=p4.rest, rest5=p5.rest;
			if(p1.workTable[i]!=4&&(p2.workTable[i]+p3.workTable[i]+p4.workTable[i]+p5.workTable[i])<8
					&&(totalReat-rest1)>=rand.nextInt(daysNumOfMonth-15)&&i>0&&i<daysNumOfMonth-1&&
					p1.workTable[i+1]!=4&&p1.workTable[i-1]!=4&&p1.rest<totalReat){
				if(i<daysNumOfMonth-2&&i>3&&p1.workTable[i-1]!=4&&p1.workTable[i-2]!=4&&
						p1.workTable[i+2]!=4&&p1.workTable[i+1]!=4 && p1.workTable[i]==0){
					p1.workTable[i]=4;
					p1.rest=sum(p1.workTable);
				}
			}
			if(i>6&&p1.workTable[i]!=4&&p1.workTable[i-2]!=4&&p1.workTable[i-3]!=4&&
					p1.workTable[i-4]!=4&&p1.workTable[i-5]!=4&&p1.workTable[i-6]!=4&&
					(p2.workTable[i]+p3.workTable[i]+p4.workTable[i]+p5.workTable[i])<8&&p1.rest<totalReat){
				if(i<daysNumOfMonth-2&&p1.workTable[i+2]!=4&&p1.workTable[i+1]!=4 && p1.workTable[i]==0){
					p1.workTable[i]=4;
					p1.rest=sum(p1.workTable);
				}
			}
			
			if(p2.workTable[i]!=4&&(p1.workTable[i]+p3.workTable[i]+p4.workTable[i]+p5.workTable[i])<8
					&&(totalReat-rest2)>=rand.nextInt(daysNumOfMonth-15)&&i>0&&i<daysNumOfMonth-1&&
					p2.workTable[i+1]!=4&&p2.workTable[i-1]!=4&&p2.rest<totalReat){
				if(i<daysNumOfMonth-2&&i>3&&p2.workTable[i-1]!=4&&p2.workTable[i-2]!=4&&
						p2.workTable[i+2]!=4&&p2.workTable[i+1]!=4 && p2.workTable[i]==0){
					p2.workTable[i]=4;
					p2.rest=sum(p2.workTable);
				}
			}
			if(i>6&&p2.workTable[i]!=4&&p2.workTable[i-2]!=4&&p2.workTable[i-3]!=4&&
					p2.workTable[i-4]!=4&&p2.workTable[i-5]!=4&&p2.workTable[i-6]!=4&&
					(p1.workTable[i]+p3.workTable[i]+p4.workTable[i]+p5.workTable[i])<8&&p2.rest<totalReat){
				if(i<daysNumOfMonth-2&&p2.workTable[i+2]!=4&&p2.workTable[i+1]!=4 && p2.workTable[i]==0){
					p2.workTable[i]=4;
					p2.rest=sum(p2.workTable);
				}
			}
			
			if(p3.workTable[i]!=4&&(p1.workTable[i]+p2.workTable[i]+p4.workTable[i]+p5.workTable[i])<8
					&&(totalReat-rest3)>=rand.nextInt(daysNumOfMonth-15)&&i>0&&i<daysNumOfMonth-1&&
					p3.workTable[i+1]!=4&&p3.workTable[i-1]!=4&&p3.rest<totalReat){
				if(i<daysNumOfMonth-2&&i>3&&p3.workTable[i-1]!=4&&p3.workTable[i-2]!=4&&
						p3.workTable[i+2]!=4&&p3.workTable[i+1]!=4 && p3.workTable[i]==0){
					p3.workTable[i]=4;
					p3.rest=sum(p3.workTable);
				}
			}
			if(i>6&&p3.workTable[i]!=4&&p3.workTable[i-1]!=4&&p3.workTable[i-2]!=4&&p3.workTable[i-3]!=4&&
					p3.workTable[i-4]!=4&&p3.workTable[i-5]!=4&&p3.workTable[i-6]!=4&&
					(p2.workTable[i]+p1.workTable[i]+p4.workTable[i]+p5.workTable[i])<8&&p3.rest<totalReat){
				if(i<daysNumOfMonth-2&&p3.workTable[i+2]!=4&&p3.workTable[i+1]!=4 && p3.workTable[i]==0){
					p3.workTable[i]=4;
					p3.rest=sum(p3.workTable);
				}
			}
			
			if(p4.workTable[i]!=4&&(p1.workTable[i]+p2.workTable[i]+p3.workTable[i]+p5.workTable[i])<8
					&&(totalReat-rest4)>=rand.nextInt(daysNumOfMonth-15)&&i>0&&i<daysNumOfMonth-1&&
					p4.workTable[i+1]!=4&&p4.workTable[i-1]!=4&&p4.rest<totalReat){
				if(i<daysNumOfMonth-2&&i>3&&p4.workTable[i-1]!=4&&p4.workTable[i-2]!=4&&
						p4.workTable[i+2]!=4&&p4.workTable[i+1]!=4 && p4.workTable[i]==0){
					p4.workTable[i]=4;
					p4.rest=sum(p4.workTable);
				}
			}
			if(i>6&&p4.workTable[i]!=4&&p4.workTable[i-1]!=4&&p4.workTable[i-2]!=4&&p4.workTable[i-3]!=4&&
					p4.workTable[i-4]!=4&&p4.workTable[i-5]!=4&&p4.workTable[i-6]!=4&&
					(p2.workTable[i]+p3.workTable[i]+p1.workTable[i]+p5.workTable[i])<8&&p4.rest<totalReat){
				if(i<daysNumOfMonth-2&&p4.workTable[i+2]!=4&&p4.workTable[i+1]!=4 && p4.workTable[i]==0){
					p4.workTable[i]=4;
					p4.rest=sum(p4.workTable);
				}
			}
			
			if(p5.workTable[i]!=4&&(p1.workTable[i]+p2.workTable[i]+p3.workTable[i]+p4.workTable[i])<8
					&&(totalReat-rest5)>=rand.nextInt(daysNumOfMonth-15)&&i>0&&i<daysNumOfMonth-1&&
					p5.workTable[i+1]!=4&&p5.workTable[i-1]!=4&&p5.rest<totalReat){
				if(i<daysNumOfMonth-2&&i>3&&p5.workTable[i-1]!=4&&p5.workTable[i-2]!=4&&
						p5.workTable[i+2]!=4&&p5.workTable[i+1]!=4 && p5.workTable[i]==0){
					p5.workTable[i]=4;
					p5.rest=sum(p5.workTable);
				}
			}
			if(i>6&&p5.workTable[i]!=4&&p5.workTable[i-1]!=4&&p5.workTable[i-2]!=4&&p5.workTable[i-3]!=4&&
					p5.workTable[i-4]!=4&&p5.workTable[i-5]!=4&&p5.workTable[i-6]!=4&&
					(p2.workTable[i]+p3.workTable[i]+p4.workTable[i]+p1.workTable[i])<8&&p5.rest<totalReat){
				if(i<daysNumOfMonth-2&&p5.workTable[i+2]!=4&&p5.workTable[i+1]!=4 && p5.workTable[i]==0){
					p5.workTable[i]=4;
					p5.rest=sum(p5.workTable);
				}
			}
		}
	}

	function insertRest(daysNumOfMonth, totalReat, p, p2, p3, p4, p5, firstTue){
		if(totalReat-p.rest>0){
			var r=totalReat-p.rest,c=0;
			while(r>0&&c<10){
				c++;
				var m=0,n=0,pos=0;//pos起点，n长度
				for(var i =0; i<daysNumOfMonth;i++){
					if(p.workTable[i]==0){
						m=m+1;
					}else{
						if(m>n){
							n=m;pos=i-n;m=0;
						}
					}
				}
				
				{
					var j=0,k=0;
					for(var i= 0; i<pos+n; i++){
						j=pos+n/2-i;k=pos+n/2+i;
						if(j%7==firstTue) continue;
						if(j>2&&p.workTable[j]!=4&&p2.workTable[j]+p3.workTable[j]+p4.workTable[j]+p5.workTable[j]<2
								&&p.workTable[j-2]!=4&&p.workTable[j+2]!=4&&r>0 && p.workTable[j]==0){
							p.workTable[j]=4;r=r-1;p.rest=sum(p.workTable);
						}
						if(k%7==firstTue) continue;
						if(k<daysNumOfMonth-2&&p.workTable[k]!=4&&p2.workTable[k]+p3.workTable[k]+p4.workTable[k]+p5.workTable[k]<2
								&&p.workTable[k-2]!=4&&p.workTable[k+2]!=4&&r>0 && p.workTable[k]==0){
							p.workTable[k]=4;r=r-1;p.rest=sum(p.workTable);
						}
					}
				}
				m=0;n=0;pos=0;//pos起点，n长度
				for(var i =0; i<daysNumOfMonth;i++){
					if(p.workTable[i]==0){
						m=m+1;
					}else{
						if(m>n){
							n=m;pos=i-n;m=0;
						}
					}
				}
				{
					var j=0,k=0;
					for(var i= 0; i<pos+n; i++){
						j=pos+n/2-i;k=pos+n/2+i;
						if(j%7==firstTue) continue;
						if(j>2&&p.workTable[j]!=4&&p2.workTable[j]+p3.workTable[j]+p4.workTable[j]+p5.workTable[j]<2
								&&p.workTable[j-2]!=4&&p.workTable[j+2]!=4&&r>0 && p.workTable[j]==0){
							p.workTable[j]=4;r=r-1;p.rest=sum(p.workTable);
						}
						if(k%7==firstTue) continue;
						if(k<daysNumOfMonth-2&&p.workTable[k]!=4&&p2.workTable[k]+p3.workTable[k]+p4.workTable[k]+p5.workTable[k]<2
								&&p.workTable[k-2]!=4&&p.workTable[k+2]!=4&&r>0 && p.workTable[k]==0){
							p.workTable[k]=4;r=r-1;p.rest=sum(p.workTable);
						}
					}
				}
				
				{
					function Rand() {};
					Rand.prototype.nextInt = function(n) {
					    return Math.round(Math.random()*n);
					};
					var rand = new Rand();

					if((p.rest=sum(p.workTable))<totalReat){
						while(i++<1000){
							var j=rand.nextInt(daysNumOfMonth)%daysNumOfMonth;
							if(j%7==firstTue) continue;
							if(j>2&&j<daysNumOfMonth-2&&p.workTable[j]!=4&&p2.workTable[j]+p3.workTable[j]+p4.workTable[j]+p5.workTable[j]<8
									&&p.workTable[j-2]!=4&&p.workTable[j+2]!=4&&r>0 && p.workTable[j]==0){
								p.workTable[j]=4;r=r-1;p.rest=sum(p.workTable);
							}
						}
					}
					i=0;
					if((p.rest=sum(p.workTable))<totalReat&&totalReat>7){
						while(i++<100){
							var j=rand.nextInt(daysNumOfMonth)%daysNumOfMonth;
							if(j%7==firstTue) continue;
							if(j>2&&j<daysNumOfMonth-2&&p.workTable[j]!=4&&p2.workTable[j]+p3.workTable[j]+p4.workTable[j]+p5.workTable[j]<12
									&&p.workTable[j-2]!=4&&p.workTable[j+2]!=4&&r>0 && p.workTable[j]==0){
								p.workTable[j]=4;r=r-1;p.rest=sum(p.workTable);
							}
						}
					}
					i = 0;
					if((p.rest=sum(p.workTable))<totalReat&&totalReat>9){
						while(i++<100){
							var j=rand.nextInt(daysNumOfMonth)%daysNumOfMonth;
							if(j%7==firstTue) continue;
							if(j>3&&j<daysNumOfMonth-3&&p.workTable[j]!=4&&p2.workTable[j]+p3.workTable[j]+p4.workTable[j]+p5.workTable[j]<12
									&&((p.workTable[j-3]!=4&&p.workTable[j+1]!=4)||(p.workTable[j-1]!=4&&p.workTable[j+3]!=4))&&r>0 && p.workTable[j]==0){
								p.workTable[j]=4;r=r-1;p.rest=sum(p.workTable);
							}
						}
					}
				}
			}
		}
	}

	function restweekendday(p,firstSat){
		var j=0;
		p.restWeekend=0;
		for(var i=firstSat;i<p.workTable.length-1;i=i+7){
			if(p.workTable[i]==4){
				p.restWeekend=p.restWeekend+1;
			}
			if(p.workTable[i+1]==4){
				p.restWeekend=p.restWeekend+1;
			}
			j=j+1;
		}
		if(p.workTable.length==31&&firstSat==2&&p.workTable[30]==4){
			p.restWeekend=p.restWeekend+1;
		}
		if(p.workTable.length==30&&firstSat==1&&p.workTable[29]==4){
			p.restWeekend=p.restWeekend+1;
		}
		if(p.workTable.length==29&&firstSat==0&&p.workTable[28]==4){
			p.restWeekend=p.restWeekend+1;
		}
		if(p.workTable.length==28&&firstSat==6&&p.workTable[27]==4){
			p.restWeekend=p.restWeekend+1;
		}
	}

	function switchResult(arr){
		var len = arr.length;
		for(var i = 0; i<len; i++){
			if (arr[i] === 0){
				arr[i] = 4;
			}else if (arr[i] === 4){
				arr[i] = 0;
			} else if (arr[i] ===5){
				arr[i] = 4;
			}
		}
	}