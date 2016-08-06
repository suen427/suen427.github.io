function changeURL(prama){
    window.history.pushState({},0,'http://'+window.location.host + window.location.pathname +'?page='+prama);
}
// tab, data-tab-target直接使用css选择器
function tabClickHandler(e){
    var $this = $(e.target);
    if($this.is('ul.tab > li:not(.active)')){
        var thisTarget = $this.data('tabTarget');
        var $currentActive = $this.siblings('li.active');
        var currentTarget = $currentActive.data('tabTarget');
        $currentActive.removeClass('active');
        $(currentTarget).hide();
        $this.addClass('active');
        $(thisTarget).show();
        var data = $this[0].dataset.tabTarget.split('#')[1]
        changeURL( data );
        document.title =  data === 'attendance'? '考勤':( data === 'schedule'? '排班' : 'I ❤ U !' );
    }
}
document.body.addEventListener('click', tabClickHandler, true);

var search = window.location.search;
if(search == '?page=attendance'){
    $('.tab-head[data-tab-target="#attendance"]').trigger('click');
    document.title = '考勤';
} else {
    changeURL('schedule');
    document.title = 'I ❤ U !';
}
/*MonthUtil*/
/*返回当前时刻的下个月*/
function MonthUtil(settings){
    this.init(settings);
}
MonthUtil.prototype = {
    init:function(settings){
        this.setMonth(settings.monthNum,settings.yearNum);
        this.monthLength = this.getDaysNumOfMonth(this.month);
        this.firstDay = this.month.getDay();//第一天是星期几
        this.firstWeekDay = this.month.getDay();
        this.double = Math.floor((this.monthLength + this.firstDay -1)/7);//一个月的连续双休日个数
        this.holiday = settings.holiday || this.monthLength - settings.workDayNum;
        this.firstSatday = 7-this.firstDay;
        this.firstSunday = (8-this.firstDay)%7;
        this.firstTuseday = (10 -this.firstDay)%7;
        if(this.firstSatday>this.firstSunday){ // 求周末天数
            if (this.monthLength>28){
                this.weekendDayNum = 9;
            }else {
                this.weekendDayNum = 8;
            }
        }else {
            var temp = this.monthLength - this.firstSatday;
            if(temp<28){
                this.weekendDayNum = 8;
            } else if (temp>28) {
                this.weekendDayNum = 10;
            } else {
                this.weekendDayNum = 9;
            }
        }
        var tableA = [0,1,1,1,1,1,0,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0],
            tableB = [0,1,1,1,1,1,0,
                0,1,1,1,1,1,1,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0,
                0,1,1,1,1,1,0];
        this.tableA = tableA.slice(this.firstDay,this.firstDay+this.monthLength);
        this.tableB = tableB.slice(this.firstDay,this.firstDay+this.monthLength);

        $('#year').val(this.month.getFullYear());
        $('#month').val(this.month.getMonth()+1);
    },
    setMonth:function (monthNum,yearNum){ // 获得下月日期对象，monthNum是月份数字0、1、2...11
        var date = new Date(),
            year = yearNum || date.getFullYear();
        if( monthNum>=0 || monthNum<12){
            var month = monthNum;
        } else {
            var month = date.getMonth()+1;
        }
        this.month = new Date(year,month,1);
    },
    getDaysNumOfMonth:function(date){
        var year = date.getFullYear(),
            month = date.getMonth();
        if(year%4==0 && month==1){
            return 29;
        }else if(month==1){
            return 28;
        }
        switch (month) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                return 31;
                break;
            case 3:
            case 5:
            case 8:
            case 10:
                return 30;
                break;
        }
    }
};
/*Person*/
-function () {
    function Person(settings,monthUtil){
        this.init(settings,monthUtil);
    }
    Person.prototype = {
        init: function (settings, monthUtil) {
            this.monthUtil = monthUtil;
            /*
            * table是Person的排班表array
            * -1表示未排班,0表示休息，其余正整数代表不同岗位
            * */
            this.table = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1].slice(0,monthUtil.monthLength);
            this.changeStatus = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].slice(0,monthUtil.monthLength);
            this.holiday = monthUtil.holiday;
            this.type = settings.type;
            this.name = settings.name;
            if(settings.preArr){
                this.setPre(settings.preArr);
            }
            this.stat={};
            this.computeStat();
        },
        setPre: function (preArr){ // 预先设置班表
            this.table = preArr.slice(0);
        },
        setHolidayNum: function (num) {
            this.holiday = num;
        },
        jobs:["休","岗1","岗2","岗3","岗4"],
        setJobs: function (jobs) {
            this.jobs = jobs;
        },
        setSchedule: function () { // 双休排班方法
            if (this.type == "A"){
                for(var i = 0; i<this.monthUtil.monthLength; i++){
                    this.table[i] = this.table[i]>-1?this.table[i]:this.monthUtil.tableA[i];
                }
            }else if(this.type == "B"){
                for(var i = 0; i<this.monthUtil.monthLength; i++){
                    this.computeStat();
                    this.table[i] = this.table[i]>-1?this.table[i]:((this.stat[this.jobs[0]] >= this.holiday && this.monthUtil.tableB[i]==0)? 1:this.monthUtil.tableB[i]);
                }
            }
            this.computeStat();
        },
        computeStat: function () {
            this.stat = {};
            for(var i = 0; i < this.table.length; i++ ){
                if(this.table[i]>-1){
                    this.stat[this.jobs[this.table[i]]] = this.stat[this.jobs[this.table[i]]]+1||1;
                }else{
                    this.stat['rest'] = this.stat['rest']+1||1;
                }
            }
        },
        setRest: function (monthUtil,i) {
            /*
            *
            * return 0 表示不休息
            *        1 表示休息一天
            *        2 表示单日和当日的后一日休息
            * */
            var firstSatday = monthUtil.firstSatday-1,
                firstSunday = monthUtil.firstSunday-1,
                firstDay = monthUtil.firstDay,
                firstMonday = (firstSunday+1)% 7,
                type = i <= 1 ? 1 :(   i < this.table.length-2 ? 2 : 3   ),
                p = (this.holiday - (this.stat[this.jobs[0]]||0))/ (this.table.length - i -1),
                nearRestFlag = false, // 前后4天是否有休息
                berforeDaytFlag = false,
                nextDaytFlag = false,
                berfore2DaytFlag = false,
                next2DaytFlag = false,
                longWorkFlag = true,
                weekendCoef = 2.4,
                satdayCoef = 3,
                longWorkCoef = 0.9;
            if ( this.holiday >= 7 ){
                weekendCoef = 2.8;
                satdayCoef = 4;
            }
            var start = Math.max(i-3,0),
                end = Math.min(this.table.length-1, i+3);
            for ( var j = start; j < end; ++j ){
                if ( j > i-2 && j < i+2){
                    continue;
                }
                if ( this.table[j] === 0 ){
                    nearRestFlag = true;
                    break;
                }
            }
            if (i > 0){
                if (this.table[i-1] === 0){
                    berforeDaytFlag  = true;
                }
            }
            if (i < this.table.length - 1){
                if (this.table[i+1] === 0){
                    nextDaytFlag  = true;
                }
            }
            if (berforeDaytFlag && i > 1 ){
                if ( this.table[i-2] === 0 ){
                    berfore2DaytFlag =true;
                }
            }
            if (nextDaytFlag && i < this.table.length - 2 ){
                if ( this.table[i+2] === 0 ){
                    next2DaytFlag =true;
                }
            }
            if ( i > 6 ){
                for ( j = i - 6; j < i ; ++j ){
                    if ( this.table[j] == 0 ){
                        longWorkFlag = false;
                        break;
                    }
                }
            } else {
                longWorkFlag = false;
            }

            if ( nearRestFlag || berfore2DaytFlag || next2DaytFlag ){
                return 0;
            }
            if ( berforeDaytFlag && nextDaytFlag ){
                return 0;
            }
            if ( i == 0) {
                return 0;
            }

            if ( longWorkFlag && (this.holiday - (this.stat[this.jobs[0]] || 0)) > 0 ) {
                p = longWorkCoef;
            }

            if( type === 2 ) {
                if (!berforeDaytFlag) {
                    if (i % 7 === firstSatday && (this.holiday - (this.stat[this.jobs[0]] || 0)) >= 2 && this.table[i + 1] === -1) {
                        if (Math.random() * satdayCoef > 1) {
                            return 2;
                        }
                    }
                }
            }
            if( i%7 == firstSatday || i%7 == firstSunday ){
                p = p*weekendCoef;
            }
            if ( i%7 == firstMonday ){
                p = 0;
            }
            if ( p > Math.random()){
                return 1;
            }
            return 0;
        },
        polishHoliday: function () {
            this.callTime = this.callTime + 1 || 0;
            if( this.callTime > 10 ) {
                alert('请再试一次！');
                return false;
            }
            var longest = this.longestWork();
            if ( longest[0] > 7 ){
                if (this.table[longest[1]+3] == -1 && this.table[longest[1]+2] !== 0 && this.table[longest[1]+4] !== 0){
                    this.table[longest[1]+3] = 0;
                } else if ( this.table[longest[1]+4] == -1  && this.table[longest[1]+3] !== 0 && this.table[longest[1]+5] !== 0 ){
                    this.table[longest[1]+4] = 0;
                }else {
                    var sr = this.singleRest();
                    if ( sr.length>0){
                        this.table[ sr[ Math.floor( Math.random()*10 ) % sr.length ]+1 ] = 0;
                    } else {
                        for ( var k = 1; k < this.table.length-1; ++k){
                            if ( this.table[k-1] !==0 && this.table[k+1] !==0 && this.table[k] === -1 ){
                                this.table[k] = 0;
                                break;
                            }
                        }
                    }
                }
            } else {
                var sr = this.singleRest();
                if ( sr.length>0 ){
                    this.table[ sr[ Math.floor( Math.random()*10 ) % sr.length ]+1 ] = 0;
                } else {
                    for ( var k = 1; k < this.table.length-1; ++k){
                        if ( this.table[k-1] !==0 && this.table[k+1] !==0 && this.table[k] === -1 ){
                            this.table[k] = 0;
                            break;
                        }
                    }
                }
            }
            this.computeStat();
            if ( this.holiday > (this.stat[this.jobs[0]] || 0) ) {
                this.polishHoliday();
            } else {
                this.callTime = 0;
            }
        },
        longestWork: function () {
            var longest = 0,
                longestPosition = 0,
                current = 0;// 当前的连续工作日长度
            for( var j = 0; j < this.table.length; ++j ){
                if ( this.table[j] !== 0){
                    current++;
                }
                else if ( current > longest ) {
                    longest = current;
                    longestPosition = j - current;
                    current = 0;
                }
            }
            return [longest,longestPosition];
        },
        singleRest: function () {
            var sr = [];
            for ( var j = 1; j < this.table.length -1; ++j ){
                if ( this.table[j] === 0 && this.table[j-1] === -1 && this.table[j+1] === -1 ){
                    sr.push(j);
                }
            }
            return sr;
        }
    };
    window.Person = Person;
}();
/*Person end*/
/*Team*/
-function () {
    function Team(settings){
        settings = settings || clone(this.defaultSettings);
        this.originSettings = clone(settings);
        this.init(settings);
        var that = this;
        $('#reset').on('click', function () {
            that.settings = clone(that.originSettings);
            that.init(that.settings);
            that.printBlankTable('table');
            that.editable = true;
            that.isLongTable = false;
        });
        $('#setSchedule').on('click', function () {
            that.init(that.settings);
            that.setSchedule();
            that.print('table');
            that.editable = true;
            that.isLongTable = false;
        });
        $('#setting').on('click', function () {
            that.setSettings();
        });
        $('#saveTable').on('click', function () {
            that.setPreSetting('table');
        });
        $('#singleDouble').on('click', function () {
            that.printBlankTable('table');
            that.singleDouble('table');
            that.editable = true;
            that.isLongTable = false;
        });
        $('#advanced').on('click', function () {
            $('#advanceDailog').removeClass('dn');
            $('#settingEdit').html(JSON.stringify(that.settings,null,4));
        });
        $('.dailog .cancel').on('click', function () {
            $('#advanceDailog').addClass('dn');
        });
        $('#svaeSetting').on('click', function () {
            var settings = $('#settingEdit').val();
            localStorage.setItem('teamSetting', settings );
            settings =  JSON.parse( settings );
            that.init(settings);
            that.originSettings = clone(settings);
            $('#advanceDailog').addClass('dn');
            that.printBlankTable('table');
        });
        $('#default').on('click', function () {
            localStorage.removeItem('teamSetting' );
            settings =  clone(that.defaultSettings);
            that.init(settings);
            that.originSettings = clone(settings);
            $('#advanceDailog').addClass('dn');
            that.printBlankTable('table');
        });
        $('#convert').on('click', function () {
            that.toLongTable('table');
            that.editable = false;
        });
        //document.addEventListener('click', function (e) {
        $(document).on('click',function (e) {
            if(!that.editable){return}
            var jobs = that.jobs;
            var target = e.target;
            if(target.nodeName.toLowerCase() === 'li' ){
                var p = target.parentNode;
                if(p.className.indexOf('select-down')>-1 ){
                    var pp = p.parentNode,
                        change = false;
                    if(target.innerHTML === '空'){
                        pp.innerHTML ='';
                        pp.className =''
                    }else if ( pp.innerHTML !== target.innerHTML){
                        pp.innerHTML = target.innerHTML;
                        pp.className = 'changed';
                        change = true;
                    }
                    if( that.haveScheduled && change ){
                        var name = pp.parentNode.getElementsByTagName('th')[1].innerHTML,
                            tds = pp.parentNode.querySelectorAll('td'),
                            work = target.innerHTML,
                            day = 0;
                        for( day = 0; day < tds.length; ++day ){
                            if ( tds[day] === pp ){
                                break;
                            }
                        }
                        that.updataTable(name,day,work);
                        that.print('table');
                    }
                }
            }
            var selectDown = document.getElementsByClassName('select-down');
            for( var i = 0; i < selectDown.length; ++i ){
                selectDown[i].parentNode.removeChild(selectDown[i]);
            }
            if( $(target).parents('#table').length < 1){return}
            if(target.nodeName.toLowerCase() === 'td'){
                if( target.parentNode.className.indexOf('C')>-1 ) {
                    var html = '<ul class="select-down">';
                    for ( var k = 0; k < jobs.length; ++k ){
                        html += '<li>'+jobs[k] + '</li>';
                    }
                    html += '<li>空</li></ul>';
                } else {
                    var html = '<ul class="select-down"><li>'+jobs[0]+'</li><li>'+jobs[1]+'</li><li>空</li></ul>';
                }
                target.innerHTML = target.innerHTML+html;
            }
        });
    }
    Team.prototype = {
        tableType: "short", // "short" or "long"
        editable: true,
        haveScheduled:false,
        isLongTable: false,
        init: function(settings){
            this.settings = settings || this.settings;
            this.monthUtil = new MonthUtil(settings.monthSetting);
            this.jobs = settings.jobs;
            var persons = settings.persons;
            this.menbers = [];
            for ( var i = 0; i < persons.length; i++){
                this.menbers[i] = new Person(persons[i],this.monthUtil);
            }
            var menbersC = [];
            for(var i = 0; i < this.menbers.length; i++ ){
                var menber = this.menbers[i];
                if(menber.type == "C"){
                    menbersC.push(menber);
                } else {
                    menber.setSchedule(this.monthUtil);
                }
            }
            this.menbersC = menbersC;
            this.haveScheduled = false;
        },
        setSchedule: function(){
            // 设置type为C的员工的班表
            //this.getPreSetting('table');
            for(var i = 0; i < this.menbers.length; i++){
                this.menbers[i].setSchedule();
            }
            var menbers = this.menbersC;
            var monthUtil = this.monthUtil;
            var jobs = this.jobs;
            var joblen = jobs.length;

            /*设置输入项*/
            $('#year').val(monthUtil.month.getFullYear());
            $('#month').val(monthUtil.month.getMonth()+1);

            /*设置job1*/
            function setFirstJob(menbers,i){
                var job1Menbers = [], j=0;
                if(setFirstJob.times == 0){
                    for( j = 0; j < menbers.length; j++ ){
                        if(menbers[j].table[i] == 1){
                            setFirstJob.times = 0;
                            return j;
                        }
                    }
                }
                for( j = 0; j < menbers.length; j++ ){
                    if( (menbers[j].stat[jobs[1]]||0) < (monthUtil.monthLength/ menbers.length ) && menbers[j].table[i] === -1 ){
                        job1Menbers.push(menbers[j]);
                    }
                }
                if(job1Menbers.length == 0 ) {
                    setFirstJob.times = 0;return -1;
                }
                setFirstJob.times++;
                if(setFirstJob.times>10){setFirstJob.times = 0;return -1;}
                var random = Math.floor(Math.random()*1000)%job1Menbers.length;
                if(job1Menbers[random].table[i]!=-1&&job1Menbers[random].table[i]!=1){
                    return setFirstJob(job1Menbers,i);
                }else{
                    job1Menbers[random].table[i] = 1;
                    job1Menbers[random].computeStat();
                    setFirstJob.times = 0;
                    return random;
                }
            }
            function setFirtJob2(menbers,i) {
                var j = 0, job1Menbers = [];
                for( j = 0; j < menbers.length; j++ ){
                    if( menbers[j].table[i] == -1 ){
                        job1Menbers.push(menbers[j]);
                    }
                }
                if ( job1Menbers.length < 1 ){
                    alert('排班失败！请重试！');
                    console.log('arrange firstJob2 fail!'+i);
                } else {
                    var random = Math.floor(Math.random()*1000)%job1Menbers.length;
                    job1Menbers[random].table[i] = 1;
                    job1Menbers[random].computeStat();
                    return random;
                }
            }
            setFirstJob.times = 0;
            for( i = 0; i < monthUtil.monthLength; i++){
                if(setFirstJob(menbers,i) == -1){
                    console.log('arrange firstJob1 fail!'+i);
                    setFirtJob2(menbers,i);
                }
            }
            this.updateStat();//更新每个人的岗位信息
            /*设置休息日*/
            function setHoliday(menbers,i){
                menbers.sort(function (a, b) {
                    return a.stat[jobs[0]] - b.stat[jobs[0]];
                });
                var firstSatday = monthUtil.firstSatday,
                    firstSunday = monthUtil.firstSunday,
                    firstDay = monthUtil.firstDay;
                for(var j = 0; j < menbers.length; j++){
                    var person = menbers[j];
                    if(person.table[i] > -1) continue;
                    var rest = person.setRest(monthUtil,i);
                    if (rest === 1){
                        person.table[i] = 0
                    } else if ( rest === 2 ){
                        person.table[i] = 0;
                        person.table[i+1] = 0;
                    }
                }
            }
            for( i = 0; i < monthUtil.monthLength; i++){
                setHoliday(menbers,i);
                this.updateStat();//更新每个人的岗位信息
            }
            /*补齐剩余休息日*/
            for( j = 0; j < menbers.length; j++){
                var person = menbers[j];
                if ( person.holiday > (person.stat[jobs[0]] || 0) ){
                    person.polishHoliday();
                }
            }

            /*设置剩余岗位*/
            function setRestDay(menbers,i){
                for(var j = 2; j < jobs.length; j++){
                    var flag = false;
                    var restPersons = [];
                    for(var k = 0; k < menbers.length; k++){
                        if(menbers[k].table[i] == j){
                            flag = true;
                        }
                        if(menbers[k].table[i] == -1){
                            restPersons.push(menbers[k]);
                        }
                    }
                    if(flag || restPersons.length == 0){continue}
                    restPersons.sort(function(a,b){
                        return a.stat[jobs[j]] - b.stat[jobs[j]];
                    });
                    var random = Math.floor(Math.random()*1000)%restPersons.length;
                    restPersons[random].table[i] = j;
                }
            }
            for( i = 0; i < monthUtil.monthLength; i++){
                setRestDay(menbers,i);
                this.updateStat();//更新每个人的岗位信息
            }
            /*设置剩余空岗位*/
            function setBlankDay(menbers){
                for(var i = 0; i < menbers.length; i++){
                    var person = menbers[i];
                    for(var j = 0; j < monthUtil.monthLength; j++){
                        if(person.table[j] == -1){
                            person.table[j] = jobs.length-1;
                        }
                    }
                }
            }
            setBlankDay(menbers);
            this.haveScheduled = true;
        },
        updateStat:function(flag){
            if(flag){
                this.menbers.forEach(function(element, index, array){
                    element.computeStat();
                })
            }else{
                this.menbersC.forEach(function(element, index, array){
                    element.computeStat();
                })
            }
        },
        print: function (id) {
            var monthUtil = this.monthUtil;
            var jobs = this.jobs;
            var html = '<thead><tr><th colspan="'+ (this.monthUtil.monthLength + 3) +'" class="header">排班表</th></tr>' +
                    '<tr><th colspan="5">项目：香醍漫步</th><th colspan="5">部门：客服中心</th>' +
                    '<th colspan="5">所属月份：' +
                    (monthUtil.month.getMonth()+1) +
                    '月</th><th colspan="5">制表人：</th><th colspan="5">部门负责人：</th>' +
                    '<th colspan="'+ (this.monthUtil.monthLength -23 + jobs.length) +'"></th></tr>' +
                    '<tr><th rowspan="3">序号</th><th  rowspan="2">日 期</th>',
                str = '<tr>',
                str2 = '<tr><th>姓名</th>',
                weeks = ['日','一','二','三','四','五','六'];

            for(var i = 0; i < this.monthUtil.monthLength; i++){
                html += '<th>'+ (i+1) +'日</th>';
                str += '<th>周'+ weeks[(i + monthUtil.firstDay)%7] +'</th>';
                str2 += '<th>岗位</th>';
            }
            for( i = 0; i < jobs.length; i++ ){
                html += '<th rowspan="3">'+ jobs[i] +'</th>';
            }
            html += '</tr>'+ str+ '</tr>'+str2+'</tr></thead>';
            for(i = 0; i < this.menbers.length; i++ ){
                var person = this.menbers[i];
                str = '<tr class="'+ person.type +'"><th>'+(i+1)+'</th><th>'+person.name+'</th>';
                for( var j = 0; j < person.table.length; j++ ){
                    if( person.table[j]==0 ){
                        str += '<td class="rest'+ (person.changeStatus[j] == 1?' changed':'') +'">'+(jobs[person.table[j]]||'')+'</td>'
                    } else {
                        str += '<td class="'+ (person.changeStatus[j] == 1?'changed':'') +'">'+(jobs[person.table[j]]||'')+'</td>'
                    }
                }
                for( var j = 0; j < jobs.length; j++ ){
                    str += '<td>'+ (person.stat[jobs[j]]||0) +'</td>';
                }
                str += '</tr>';
                html += str;
            }
            document.getElementById(id).innerHTML = html;
        },
        printBlankTable: function (id) {
            var monthUtil = this.monthUtil;
            var jobs = this.jobs;
            var html = '<thead><tr><th colspan="'+ (this.monthUtil.monthLength + 3 + jobs.length) +'" class="header">排班表</th></tr>' +
                    '<tr><th colspan="5">项目：香醍漫步</th><th colspan="5">部门：客服中心</th>' +
                    '<th colspan="5">所属月份：' +
                    (monthUtil.month.getMonth()+1) +
                    '月</th><th colspan="5">制表人：</th><th colspan="5">部门负责人：</th>' +
                    '<th colspan="'+ (this.monthUtil.monthLength -23 + jobs.length) +'"></th></tr>' +
                    '<tr><th rowspan="3">序号</th><th  rowspan="2">日 期</th>',
                str = '<tr>',
                str2 = '<tr><th>姓名</th>',
                weeks = ['日','一','二','三','四','五','六'];

            for(var i = 0; i < this.monthUtil.monthLength; i++){
                html += '<th>'+ (i+1) +'日</th>';
                str += '<th>周'+ weeks[(i + monthUtil.firstDay)%7] +'</th>';
                str2 += '<th>岗位</th>';
            }
            for( i = 0; i < jobs.length; i++ ){
                html += '<th rowspan="3">'+ jobs[i] +'</th>';
            }
            html += '</tr>'+ str+ '</tr>'+str2+'</tr></thead>';
            for(i = 0; i < this.menbers.length; i++ ){
                var person = this.menbers[i];
                str = '<tr class="'+ person.type +'"><th>'+(i+1)+'</th><th>'+person.name+'</th>';
                for( var j = 0; j < person.table.length; j++ ){
                    str += '<td></td>'
                }
                for( var j = 0; j < jobs.length; j++ ){
                    str += '<td></td>';
                }
                str += '</tr>';
                html += str;
            }
            var table =  document.getElementById(id);
            table.innerHTML = html;
            this.haveScheduled = false;
        },
        setPreSetting: function (id) {
            var jobs = this.jobs;
            var settings = this.settings;
            var table = document.getElementById(id);
            var trs = table.getElementsByTagName('tr');
            if( trs.length < 2  ){return}
            var names = [];
            var name = '';
            for( var i = 2; i < trs.length; ++i ){
                name = trs[i].getElementsByTagName('th')[1].innerHTML;
                names.push(name);
            }

            var persons = settings.persons;
            var jobs = settings.jobs;
            var person = null;
            var tds = null;
            for ( i = 0; i < persons.length; ++i ){
                person = persons[i];
                person.preArr = [];
                tds = trs[names.indexOf(person.name)+2].getElementsByTagName('td');
                for ( var j = 0; j < tds.length-jobs.length; ++j ){
                    person.preArr[j] = jobs.indexOf( tds[j].innerHTML );
                }
            }
        },
        setSettings: function (settings) {
            this.settings = clone(this.originSettings);
            if(settings){
                $.extend(this.settings,settings);
            }else{
                settings = this.settings;
                var monthSetting = settings.monthSetting;
                monthSetting.yearNum = $('#year').val() ||  monthSetting.yearNum;
                monthSetting.monthNum = $('#month').val()-1 || monthSetting.monthNum;
                monthSetting.workDayNum = $('#workday').val() || monthSetting.workDayNum;
            }
            this.init(this.settings);
        },
        singleDouble: function (id) {
            var settings = this.settings,
                monthUtil = this.monthUtil,
                holiday = monthUtil.holiday,
                monthLength = monthUtil.monthLength,
                firstDay = monthUtil.firstDay,
                jobs = this.jobs,
                tables;
            if(holiday>6){
                tables = [
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ]
                ];
            } else {
                tables = [
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ],
                    [
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,0,0,
                        -1,-1,-1,-1,-1,-1,0,
                        -1,-1,-1,-1,-1,0,-1,
                        -1,-1,-1,-1,-1,-1,-1
                    ]
                ];
            }
            var menbers = this.menbersC;
            var trs = document.getElementById(id).getElementsByTagName('tr');
            var tds = null, i = 0, j = 0, table = [], n=0;

            var names = [];
            var name = '';
            for( i = 5 ; i < trs.length; ++i ){
                name = trs[i].getElementsByTagName('th')[1].innerHTML;
                names.push(name);
            }
            for (  i = 0; i < menbers.length; ++i ){
                if( tables.length < 1 ){ return }
                n = names.indexOf(menbers[i].name);
                if( n === -1 ){ break }
                tds = trs[n+5].getElementsByTagName('td');
                table = tables.splice(Math.floor(Math.random()*100)%tables.length,1)[0];
                table = table.slice((firstDay+6)%7,(firstDay+6)%7+monthLength);
                for( j = 0; j < monthLength; ++j ){
                    if( table[j] === 0 ){
                        tds[j].innerHTML = jobs[0];
                    }else {
                        tds[j].innerHTML = '';
                    }
                }
            }
        },
        toLongTable: function (id) {
            if(this.isLongTable){
                return;
            }
            var jobs = this.jobs;
            var table = document.getElementById(id);
            var tds = table.getElementsByTagName('td');
            var job;
            for ( var i = tds.length-1; i > -1; --i ){
                job = jobs.indexOf( tds[i].innerHTML );
                if( job == 0 ){
                    tds[i].outerHTML = '<td class="rest">'+jobs[job]+'</td><td class="rest">-</td>';
                }else if ( job>-1){
                    if ( tds[i].parentNode.className.indexOf('C')>-1 ){
                        tds[i].outerHTML = '<td>A</td><td>'+jobs[job]+'</td>';
                    } else if ( tds[i].parentNode.className.indexOf('A')>-1 ) {
                        tds[i].outerHTML = '<td>A</td><td>-</td>';
                    } else if ( tds[i].parentNode.className.indexOf('B')>-1 ) {
                        tds[i].outerHTML = '<td>B</td><td>-</td>';
                    }
                }else if(tds[i].innerHTML == ""){
                    if(tds[i].parentNode.className.indexOf('zhiye')  == -1){
                        tds[i].outerHTML = '<td></td><td></td>';
                    }
                }
            }

            var html = table.innerHTML;
            var reg1 = /<th>(\d+)日/g,
                reg2 = /<th>周(\W)/g,
                reg3 = /<th>岗位/g;
            html = html.replace( reg1, '<th colspan="2">$1日');
            html = html.replace( reg2, '<th colspan="2">周$1');
            html = html.replace( reg3, '<th>班次</th><th>岗位');
            html = html.replace( /<th colspan="34"/, '<th colspan="65"');
            html = html.replace( /<th colspan="33"/, '<th colspan="63"');
            html = html.replace( /<th colspan="39"/, '<th colspan="65"');
            html = html.replace( /<th colspan="38"/, '<th colspan="63"');
            html = html.replace( /<th colspan="12"><\/th>/, '<th colspan="38"><\/th>');
            html = html.replace( /<th colspan="13"><\/th>/, '<th colspan="40"><\/th>');
            html = html.replace( /<th colspan="11"><\/th>/, '<th colspan="36"><\/th>');
            html = html.replace( /<th colspan="10"><\/th>/, '<th colspan="34"><\/th>');

            table.innerHTML = html;
            this.isLongTable = true;
        },
        defaultSettings: {
            jobs:["休","岗1","岗2","岗3","岗4"],
            persons:[
                {name:"戎超群",type:"C"},
                {name:"蒲磾",type:"C"},
                {name:"叶佳莹",type:"C"},
                {name:"张智",type:"C"},
                {name:"邬凯",type:"A"},
                {name:"吴艳",type:"A"},
                {name:"沈桂玲",type:"B"},
                {name:"宓雪玲",type:"B"},
                {name:"谢井平",type:"B"}
            ],
            monthSetting:{
                //yearNum:2016,
                //monthNum:4,// 获得下月日期对象，monthNum是月份数字0、1、2...11
                workDayNum:24 // 一个月中的工作天数
            }
        },
        updataTable: function (name, day, work) {
            /*
             * name: String
             * day: Num,0,1,2...
             * work: String
             */
            var re = null;
            for( var i = 0; i < this.menbers.length; ++i ){
                if(this.menbers[i].name == name){
                    this.menbers[i].table[day] = this.jobs.indexOf(work);
                    this.menbers[i].changeStatus[day] = 1;
                    this.menbers[i].computeStat();
                    re = name;
                    break;
                }
            }
            if(!re){
                throw new Error('没有找到'+name);
            }
        }
    };
    var teamSetting = JSON.parse( localStorage.getItem('teamSetting') );
    var team = new Team(teamSetting);
    team.printBlankTable('table');
    window.team = team;
}();

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}



/* 考勤 */
+function () {
    //读取考勤记录
    function readClock(e){
        var file = document.getElementById('clock').files[0];
        if (file) {
            var fr = new FileReader();
            fr.readAsText(file,'gb2312');
            fr.onload = function(e){
                document.getElementById('input').innerHTML = e.target.result;
            }
        }else{
            document.getElementById('input').innerHTML = '';
        }
    }
    $('#clock').on('change',readClock);
    //读取班表
    function readWorkTable(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        if( !file ){
            window.workTables = null;
            return;
        }
        var name = file.name;
        var type = name.split('.');
        type = type[type.length-1];
        type = type === 'xlsx'?XLSX:XLS;
        reader.onload = function(e) {
            var data = e.target.result;
            window.workTables = type.read(data, {type: 'binary'});
        };
        reader.readAsBinaryString(file);
    }
    $('#workTable').on('change',readWorkTable);

    $('#analyze').on('click', analyze );
    function analyze(){
        var mode = $('#season').hasClass('opened')? 'summer':'winter',
            monthZh = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
        var workTables = window.workTables,
            clock = $('#input'),
            clockTables = $('#input table');
        if( clockTables.length < 1 ){
            alert('请选择考勤文件！');
            return;
        }
        if( !workTables ){
            alert('请选排班表！');
            return;
        }
        var month = parseInt( clock[0].innerHTML.split('月份')[1].substr(1,3));
        var sheetNames = workTables.SheetNames,
            sheetName = null,
            sheet = null;
        for( var i = 0; i < sheetNames.length; ++i ){
            if( sheetNames[i].indexOf(month+'月') > -1 || sheetNames[i].indexOf(monthZh[month-1])>-1 ){
                if( month < 3 && sheetNames[i].indexOf(month+10+'月') === -1 && sheetNames[i].indexOf(monthZh[month+9]) === -1 ){
                    sheetName = sheetNames[i];
                    sheet = workTables.Sheets[sheetName];
                } else {
                    sheetName = sheetNames[i];
                    sheet = workTables.Sheets[sheetName];
                }
            }
            if( !sheetName ) {
                sheetName = sheetNames[sheetNames.length-1];
                sheet = workTables.Sheets[sheetName];
            }
        }

        // 考勤情况
        function getTimeTable( tableElement ){
            var e = $(tableElement),
                r = {};
            r.name = e.find('td')[1].innerHTML.split('姓名:')[1].split('&nbsp;')[0];
            var tds = e.find('td');
            r.timeFlags = [];
            var am1,am2,am3,am4,am5,
                pm1,pm2,pm3,pm4,pm5,pm6,pm7,
                times;
            for(var i = 20; i < 36; ++i){
                times = tds[i].innerHTML;
                r.timeFlags.push({
                    am1 : /0[567]:\d\d/.test(times),
                    am2 : /08:[012]\d/.test(times),//8点-8点半
                    am3 : /08:[345]\d/.test(times),//8点半-9点
                    am4 : /09:\d\d/.test(times),//早上9点-10点
                    am5 : /1[01]:\d\d/.test(times),//10点之后
                    pm1 : /1[45]:\d\d/.test(times),//下午2点-4点
                    pm2 : /16:[123]\d/.test(times),//下午4点-4点半
                    pm3 : /16:[345]\d/.test(times),//下午4点半-5点
                    pm4 : /17:[012]\d/.test(times),//下午5点-5点半
                    pm5 : /17:[345]\d/.test(times),//下午5点半-6点
                    pm6 : /1[89]:\d\d/.test(times),//下午6点-晚上8点
                    pm7 : /2[0123]:\d\d/.test(times)//晚上8点-晚上12点
                })
            }
            for(var i = 54; i < 69; ++i){
                times = tds[i].innerHTML;
                r.timeFlags.push({
                    am1 : /0[567]:\d\d/.test(times),
                    am2 : /08:[012]\d/.test(times),//8点-8点半
                    am3 : /08:[345]\d/.test(times),//8点半-9点
                    am4 : /09:\d\d/.test(times),//早上9点-10点
                    am5 : /1[01]:\d\d/.test(times),//10点之后
                    pm1 : /1[45]:\d\d/.test(times),//下午2点-4点
                    pm2 : /16:[123]\d/.test(times),//下午4点-4点半
                    pm3 : /16:[345]\d/.test(times),//下午4点半-5点
                    pm4 : /17:[012]\d/.test(times),//下午5点-5点半
                    pm5 : /17:[345]\d/.test(times),//下午5点半-6点
                    pm6 : /1[89]:\d\d/.test(times),//下午6点-晚上8点
                    pm7 : /2[0123]:\d\d/.test(times)//晚上8点-晚上12点
                })
            }
            return r;
        }
        var clockPersons = [];
        for ( i = 0; i < clockTables.length; ++i ){
            clockPersons.push(getTimeTable( clockTables[i] ));
        }

        function getNamePosition(sheet){
            for(var v in sheet){
                if(sheet[v].v && sheet[v].v.indexOf('姓名') > -1){
                    return v;
                }
            }
        }
        var positionName = getNamePosition(sheet);
        var names = [],
            namesIndex = [],
            v,
            col,
            row;
        if(positionName){
            col = positionName.match(/[A-Za-z]+/)[0].trim();
            row = positionName.match(/\d+/)[0].trim();
            for( i = 1; ; ++i ){
                v = col+ (parseInt(row)+i);
                if( sheet[v]){
                    namesIndex.push(v);
                    names.push(sheet[v].v)
                } else{
                    break;
                }
            }
        } else {
            alert("班表内未找到姓名");
            return
        }
        var persons = [],
            monthUtil = new MonthUtil({
                monthNum:month-1
            }),
            monthLength = monthUtil.monthLength,
            j= 0,
            personWorkTable;
        for( i = 0; i < names.length; ++i ){
            personWorkTable = [];
            col = namesIndex[i].match(/[A-Za-z]+/)[0].trim();
            row = namesIndex[i].match(/\d+/)[0].trim();
            for( j = 0; j < monthLength; ++j ){
                col.charCodeAt(0);

                personWorkTable[j] = {
                    'type': sheet[ strPlus(col,1+2*j)+row ]?sheet[ strPlus(col,1+2*j)+row ].v : '',
                    'work': sheet[ strPlus(col,2+2*j)+row ]?sheet[ strPlus(col,2+2*j)+row ].v : ''
                }
            }
            persons.push({
                'name': names[i],
                'workTable': personWorkTable
            })
        }
        function stat(mode, persons, clockPersons, names){
            function getClockTable(clockPersons,name ){
                for( var i = 0; i < clockPersons.length; ++i ){
                    if( name === clockPersons[i].name ){
                        return clockPersons[i].timeFlags;
                    }
                }
                return null
            }
            function statPerson(name,workTable,clockTable,mode){
                var result = {messages:[],states: [0,0,0,0]},
                    states = result.states,
                    isSummer = mode == 'summer',
                    isWinter = !isSummer,
                    html,
                    clockObj,
                    workObj,
                    am1,am2,am3,am4,am5,
                    pm1,pm2,pm3,pm4,pm5,pm6,pm7,
                    morning,afternoon,isLate,isLeave,
                    month = parseInt( $('#input')[0].innerHTML.split('月份')[1].substr(1,3)) || new Date().getMonth() ;
                mode = mode || 'summer';
                if(!clockTable){
                    result.err = '未找到这个月的打卡记录';
                } else {
                    for(var i = 0; i < workTable.length; ++i ){
                        clockObj = clockTable[i];
                        workObj = workTable[i];
                        am1 = clockObj.am1;
                        am2 = clockObj.am2;
                        am3 = clockObj.am3;
                        am4 = clockObj.am4;
                        am5 = clockObj.am5;
                        pm1 = clockObj.pm1;
                        pm2 = clockObj.pm2;
                        pm3 = clockObj.pm3;
                        pm4 = clockObj.pm4;
                        pm5 = clockObj.pm5;
                        pm6 = clockObj.pm6;
                        pm7 = clockObj.pm7;
                        if( workObj.type == '休' ){
                            continue
                        }
                        morning =  (am1 || am2) || ( am3 && isSummer);
                        isLate = (!morning) && (am3 || am4 || am5);
                        afternoon = (pm7 || pm6 || pm5) || ( pm4 && isWinter);
                        isLeave = (!afternoon) && (pm1 || pm2 || pm3 || pm4 || pm5);
                        if( !( morning || afternoon )){
                            result.messages.push([month+'月'+(i+1)+'日全天','未打卡',isLate,isLeave]);
                            states[2] = states[2]+1;
                            states[3] = states[3]+1;
                            if(isLate){states[0] = states[0]+1;}
                            if(isLeave){states[1] = states[1]+1;}
                            continue
                        }
                        if( !morning ){
                            result.messages.push([month+'月'+(i+1)+'日上午'+ (isSummer?'9:00':'8:30'),'未打卡上班',isLate,isLeave]);
                            states[2] = states[2]+1;
                            if(isLate){states[0] = states[0]+1;}
                            continue
                        }
                        if( !afternoon ){
                            result.messages.push([month+'月'+(i+1)+'日下午'+ (isSummer?'17:30':'17:00'),'未打卡下班',isLate,isLeave]);
                            states[3] = states[3]+1;
                            if(isLeave){states[1] = states[1]+1;}
                            continue
                        }
                    }
                }
                return result;
            }
            function outputInfo(name,personInfo,infoTable,statisticTable){
                var html = '',
                    positions = {
                        '戎超群':'物业客服专员',
                        '吴丹丹':'物业客服专员',
                        '叶佳莹':'物业客服专员',
                        '张智':'物业客服专员',
                        '夏雨':'物业客服专员',
                        '司超':'物业秩序维护主管',
                        '宓雪玲': '物业保洁班长',
                        '吴艳': '物业客服经理',
                        '物业库管员': '物业库管员',
                        '邬凯': '物业项目经理',
                        '向前': '物业工程主管',
                        '谢井平': '物业保洁员'
                    },
                    temp = ['<tr><td>',name,'</td><td>',positions[name],'</td><td>','异常时间段','</td><td>','异常事件','</td><td></td><td></td><td>','','</td>'],
                    mesags = personInfo.messages,
                    mesag,
                    states = personInfo.states;
                if ( personInfo.err ){
                    temp[5] = '';
                    temp[7] = '<spam class="warning">'+personInfo.err+'</span>';
                    html = temp.join('');
                    $(infoTable).append(html);
                } else{
                    for(var i = 0; i < mesags.length; ++i ){
                        mesag = mesags[i];
                        temp[5] = mesag[0];
                        temp[7] = mesag[1];
                        temp[9] = (mesag[2]?'迟到':'') + (mesag[3]?'早退':'');
                        html += temp.join('');
                    }
                    $(infoTable).append(html);
                    $(statisticTable).append('<tr><td>'+name+'</td><td>'+states[0]+'</td><td>'+states[1]+'</td><td>'+states[2]+'</td><td>'+states[3]+'</td></tr>');
                }
            }
            $('#output').html('<thead><tr><th colspan="6">香醍漫步 项目 客服中心部门考勤异常统计表（'+
                monthUtil.month.getFullYear() +'年'+  (monthUtil.month.getMonth() + 1) +'月）</th>' +
                '<th></th></tr><tr><th>考勤异常人员姓名</th><th>岗位</th><th>异常时间段</th>' +
                '<th>异常事件</th><th>异常缘由</th><th>直接上级签核</th><th>备注</th></tr></thead>');
            $('#statistic').html('<thead><tr><th>姓名</th><th>迟到</th><th>早退</th><th>早上未打卡</th><th>晚上未打卡</th></tr></thead>');
            var person,
                name,
                clockTable,
                workTable,
                personInfo;
            for( var i = 0; i < persons.length; ++i ){
                person = persons[i];
                name = person.name;
                workTable = person.workTable;
                clockTable = getClockTable(clockPersons,name );
                if( name === '值夜' || name === '值班' ){continue}
                personInfo = statPerson(name,workTable,clockTable,mode);
                outputInfo(name,personInfo,'#output','#statistic');
            }
        }
        stat(mode,persons,clockPersons,names);
    }
}();

function strPlus(str,n){
    /*
    * 如 strPlus('AZ',1)  返回'BA'
    * strPlus('Z',1)  返回'AA'
    * */
    var str = str.toUpperCase().split(''),
        charCode,
        carry,
        current = n,
        result = [];
    for( var i = str.length-1; ; --i ){
        if( i > -1 ){
            charCode = str[i].charCodeAt(0);
            if( charCode>90 || charCode < 65 ){
                console.log('err:str out of code arrange A-Z!');
                return
            }
        } else {
            charCode = 64;
        }
        carry = Math.floor(current/26);
        current = current%26;
        if( charCode + current > 90 ){
            carry++;
            result.unshift( String.fromCharCode( charCode + current -26 ) );
        } else {
            result.unshift( String.fromCharCode( charCode + current ) );
        }
        if( !carry ){break}
        current = carry;
    }
    if( str.length > result.length ){
        str.splice( - result.length);
        result = str.concat(result);
    }
    return result.join('');
}

$('body').on('click','.switch', function (e) {
    $(this).toggleClass('opened');
});
