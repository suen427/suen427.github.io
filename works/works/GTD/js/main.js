+function () {
	var tasks;
	tasks = getData();
	var categories = document.getElementsByClassName("categories")[0];
	var category = document.getElementsByClassName("category")[0];

	if (!tasks) {
		// 活动json数据
		var url = 'http://suen427.github.io/works/GTD/gtd.json';
		var xhr = new XMLHttpRequest();
		
		xhr.open('get', url);
		xhr.send();
		xhr.onreadystatechange = function(){
			if( xhr.readyState == 4 ){
				tasks = JSON.parse( xhr.responseText ).categories;
				if(!tasks) {
					tasks = {
						categoryName: '默认分类',
						childrenNum: 0,
						childCategories: [],
						tasks: []
					}
				}
				for (var i = 0; i < tasks.length; i++) {
					var li = document.createElement("li");
					if ( i == 0 ) {
						li.className = 'active';
					}
					cateA = tasks[i]; // 一级分类
					var h4 = document.createElement('h4');
					h4.innerHTML = '<span class="fa fa-folder"></span> ' + cateA.categoryName + '(' +cateA.childrenNum + ') <span class="close fa fa-times"></span>';
					var ul = document.createElement('ul');
					for ( var j = 0; j < cateA.childCategories.length; j++) {
						var child = document.createElement("li");
						var cateB = cateA.childCategories[j];  // 二级分类
						child.innerHTML = '<span class="fa fa-file-o"></span> ' + cateB.categoryName + '(' +cateB.childrenNum + ') <span class="close fa fa-times"></span>';
						ul.appendChild(child);
					}
					li.appendChild(h4);
					li.appendChild(ul);
					category.appendChild(li);
				}
				updateTask(tasks[0].categoryName);// 第一个分类任务列表
				updateDetail (tasks[0].tasks[0].task[0].name, tasks[0].categoryName);// 第一个任务列表的第一个任务
			}
		}
	} else {
		if(!tasks) {
			tasks = {
				categoryName: '默认分类',
				childrenNum: 0,
				childCategories: [],
				tasks: []
			}
		}
		for (var i = 0; i < tasks.length; i++) {
			var li = document.createElement("li");
			if ( i == 0 ) {
				li.className = 'active';
			}
			cateA = tasks[i]; // 一级分类
			var h4 = document.createElement('h4');
			h4.innerHTML = '<span class="fa fa-folder"></span> ' + cateA.categoryName + '(' +cateA.childrenNum + ') <span class="close fa fa-times"></span>';
			var ul = document.createElement('ul');
			for ( var j = 0; j < cateA.childCategories.length; j++) {
				var child = document.createElement("li");
				var cateB = cateA.childCategories[j];  // 二级分类
				child.innerHTML = '<span class="fa fa-file-o"></span> ' + cateB.categoryName + '(' +cateB.childrenNum + ') <span class="close fa fa-times"></span>';
				ul.appendChild(child);
			}
			li.appendChild(h4);
			li.appendChild(ul);
			category.appendChild(li);
		}
		updateTask(tasks[0].categoryName);// 第一个分类任务列表
		updateDetail (tasks[0].tasks[0].task[0].name, tasks[0].categoryName);// 第一个任务列表的第一个任务
	}
	




	// 左侧分类标签事件
	categories.addEventListener('click', function (event) {
		var target = event.target;

		// 删除分类
		if ( target.className.indexOf('close')>-1) {
			var toDelete = target.parentNode;
			
			if (toDelete.id.indexOf('default') > -1 || (toDelete.parentNode.previousElementSibling && toDelete.parentNode.previousElementSibling.id.indexOf('default')>-1)) {
				alert("不能修改默认分类！");
				return;
			}
			if (confirm('确定删除分类：'+target.parentNode.innerText)) {
				if (target.parentNode.nodeName.toLowerCase() == 'li') {
					var cateNode = target.parentNode;
					var cateName = getCateName( cateNode.innerText );
					var parentCateName = getCateName( findParentCate ( cateNode ) );
					removeCate(cateName, parentCateName);

					target.parentNode.parentNode.removeChild(target.parentNode);
					updateTask(tasks[0].categoryName);// 第一个分类任务列表
					updateDetail (tasks[0].tasks[0].task[0].name, tasks[0].categoryName);// 第一个任务列表的第一个任务
					syncTasks( parentCateName );
					return;
				} else if ( target.parentNode.nodeName.toLowerCase() == 'h4' ) {
					var cateNode = target.parentNode;
					var cateName = getCateName( cateNode.innerText );
					removeCate(cateName, parentCateName);

					target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
					updateTask(tasks[0].categoryName);// 第一个分类任务列表
					updateDetail (tasks[0].tasks[0].task[0].name, tasks[0].categoryName);// 第一个任务列表的第一个任务
					return;
				}
			}
		}

		// 切换active类 方法1
		/*var active = categories.getElementsByClassName("active")[0];
		var show = categories.getElementsByClassName("show")[0];
		if ( target.nodeName.toLowerCase() == 'h4' || target.nodeName.toLowerCase() == 'li'
			|| target.nodeName.toLowerCase() == 'h3' ) {
			if (target === active ) { return }
			if (!!active){
				active.className = active.className.replace('active', '');
			}
			target.className = target.className+' active';
			if (target.parentNode.className.indexOf('show') > -1 ) { return }
			if (!!show){
				show.className = show.className.replace('show', '');
			}
			target.parentNode.getElementsByTagName('ul')[0].className += ' show';
		} else if ( target.className.indexOf('fa') >-1 ) {
			if (!!active){
				active.className = active.className.replace('active', '');
			}
		}*/

		// 切换active类 方法2
		var active = categories.getElementsByClassName("active")[0];
		var show = categories.getElementsByClassName("show")[0];
		if ( target.nodeName.toLowerCase() == 'h4' || target.nodeName.toLowerCase() == 'li'
			|| target.nodeName.toLowerCase() == 'h3' || target.className.indexOf('fa') >-1) {
			if ( target.className.indexOf('fa') >-1 ) {
				target = target.parentNode;
			}
			if (!!active){
				active.className = active.className.replace('active', '');
			}
			target.className = target.className+' active';

			var cateName = target.innerText.split('(')[0].trim();
			if (target.nodeName.toLowerCase() == 'li') {
				var parentCateName = target.parentNode.previousElementSibling.innerText.split('(')[0].trim();
			}
			updateTask(cateName, parentCateName);
			if (target.parentNode.className.indexOf('show') > -1 ) { return }
			var ul = target.parentNode.getElementsByTagName('ul')[0];
			if (ul.className.indexOf('show') > -1 ) {
				ul.className = ul.className.replace('show', '');
			} else {
				ul.className += ' show';
			}
		}
	});

	// 增加分类
	var addClass = document.getElementsByClassName('add-class')[0];
	addClass.addEventListener('click', function (event) {
		var active = categories.getElementsByClassName("active")[0];
		if (active.id.indexOf('default') > -1 || (active.parentNode.previousElementSibling && active.parentNode.previousElementSibling.id.indexOf('default')>-1)) {
			alert("不能修改默认分类！");
			return;
		}
		var newCategoryName = prompt("新增分类名：");
		if (!!newCategoryName) {
			
			var newCategory = document.createElement("li");
			if ( active.nodeName.toLowerCase() == "h3") {
				var h4 = document.createElement('h4');
				h4.innerHTML = '<span class="fa fa-folder"></span> '+newCategoryName+' <span class="close fa fa-times"></span>';
				var ul = document.createElement('ul');
				newCategory.appendChild(h4);
				newCategory.appendChild(ul)
				var parent = categories.getElementsByClassName('category')[0];
				parent.appendChild(newCategory);

				addCate ( newCategoryName );
			}
			if ( active.nodeName.toLowerCase() == "h4") {
				var li = document.createElement('li');
				li.innerHTML = '<span class="fa fa-file-o"></span> '+newCategoryName+' <span class="close fa fa-times"></span>';
				var parent = active.parentNode.getElementsByTagName('ul')[0];
				parent.appendChild(li);
				addCate ( newCategoryName, getCateName( parent.previousElementSibling.innerText) );
			}
			if ( active.nodeName.toLowerCase() == "li") {
				var li = document.createElement('li');
				li.innerHTML = '<span class="fa fa-file-o"></span> '+newCategoryName+' <span class="close fa fa-times"></span>';
				var parent = active.parentNode;
				parent.appendChild(li);
				addCate ( newCategoryName, getCateName( parent.previousElementSibling.innerText) );
			}

		}
	})

	// 中间任务分类事件 全部任务、未完成任务、完成任务的切换
	var taskHeader = document.getElementsByClassName("task-header")[0];
	taskHeader.addEventListener('click', function (event) {
		var target = event.target;
		if ( target.nodeName.toLowerCase() == 'span') {
			var statuses = taskHeader.getElementsByTagName('span');
			for (var i = 0; i < statuses.length; i++) {
				statuses[i].className = "";
			}
			target.className = 'active';
			taskHeader.parentNode.className = "tasks" + (target.id == 'all-task'? '':' '+target.id);
		}
	})

	// 中间任务选择
	var taskList = document.getElementsByClassName('task-list')[0];
	taskList.addEventListener('click', function (event) {
		var target = event.target;
		if ( target.nodeName.toLowerCase() == 'li') {
			var task = target.innerText;
			//  to be done
			var cateName = taskList.getAttribute('cateName');
			var parentCateName = taskList.getAttribute('parentCateName');
			if (parentCateName == null) {
				parentCateName = undefined;
			}
			updateDetail (task, cateName, parentCateName);
		}
	})

	// 中间增加任务
	var addTask = document.getElementsByClassName('add-task')[0];
	var addDialog = document.getElementsByClassName('add-dialog')[0];
	var saveButton = document.getElementById('save');
	var cancelButton = document.getElementById('cancel');

	addTask.addEventListener('click', function (event) {
		var target = event.target;
		addDialog.style.display = 'block';
	})
	cancelButton.addEventListener('click', function (event) {
		event.stopPropagation();
		event.preventDefault();
		addDialog.style.display = 'none';
	})
	saveButton.addEventListener('click', function (event) {
		event.stopPropagation();
		event.preventDefault();

		var target = event.target;
		var form = document.getElementById("formAddTask");
		if ( target.id == 'save' ) {
			if ( !form.date.value || !form.task.value ){
				alert("请填写日期与内容！");
				return;
			}
			var cateName = taskList.getAttribute('cateName');
			var parentCateName = taskList.getAttribute('parentCateName');
			if (!parentCateName) {
				parentCateName = undefined;
			}
			var newTaskName = form.task.value.trim();
			var date = form.date.value
			var tasks = findTasksByDate(date, cateName, parentCateName);
			if (!!tasks) {
				for ( var i = 0; i < tasks.length; i++) {
					if ( tasks[i].name == newTaskName ) {
						alert("已经存在任务："+newTaskName+"!");
						return;
					}
				}
			}
			var newTask = document.createElement('li');
			if (!!tasks) {
				tasksH4Date = taskList.getElementsByTagName('h4');
				for (var i = 0; i < tasksH4Date.length; i++ ) {
					if ( dateIsEqual (tasksH4Date[i].innerHTML.trim(), date) ) {
						newTask = tasksH4Date[i].parentNode; // ul
						var task = document.createElement('li');
						task.innerHTML = newTaskName;
						task.className = 'task';
						newTask .appendChild(task);
					}
				}
			} else {
				var h4 = document.createElement('h4');
				h4.innerHTML = date;
				var ul = document.createElement('ul');
				var li = document.createElement('li');
				li.innerHTML = newTaskName;
				li.className = 'task';
				ul.appendChild(li);
				taskList.appendChild(h4);
				taskList.appendChild(ul);
			}
			addTaskToTasks ( newTaskName, date, cateName, parentCateName );
			addDialog.style.display = 'none';
			syncTasks( parentCateName || cateName );
			updateCate ( cateName, parentCateName );
			updateTask( cateName, parentCateName );
		}
	});

	// 右侧编辑和完成操作
	var completeButton = document.getElementById("setcomplete");
	var editButton = document.getElementById("edit");
	completeButton.addEventListener('click', function (event) {
		var target = event.target;
		var taskName = target.parentNode.getElementsByTagName('h4')[0].innerText.trim();
		var taskList = document.getElementsByClassName('task-list')[0];
		var cateName = taskList.getAttribute('cateName');
		var parentCateName = taskList.getAttribute('parentCateName');
		var date = target.parentNode.getElementsByClassName('date')[0].innerText.trim();
		if (!parentCateName) { parentCateName = undefined }
		updateTaskStatus ( 'complete', taskName, date, cateName, parentCateName );
		syncTasks( parentCateName || cateName );
		updateTask(cateName, parentCateName);
		updateDetail( taskName, cateName, parentCateName );
	});
	editButton.addEventListener('click', function (event) {
		var target = event.target;
		var detail = document.getElementsByClassName('edit-dialog')[0];
		detail.style.display = 'block';
		var cateName = taskList.getAttribute('cateName');
		var parentCateName = taskList.getAttribute('parentCateName');
		if (!parentCateName) { parentCateName = undefined }
		var taskName = target.parentNode.getElementsByTagName('h4')[0].innerText.trim();
		var cate = findCate (cateName, parentCateName);
		var tasks = findTaskByName (taskName, cate.tasks );
		var form = detail.getElementsByTagName('form')[0];
		var date = tasks[1].split('-');
		for ( var j = 1; j < 3; j++){
			date[j] = (date[j].length == 1 ? '0'+date[j] : date[j] );
		}
		date = date.join('-');
		form.date.value = date;
		form.date.setAttribute('disabled', 'disabled');
		form.task.value = taskName;
		form.task.setAttribute('disabled', 'disabled');
		form.detail.value = tasks[0].detail;
	});
	var editSave = document.getElementById('edit-save');
	var editCancel = document.getElementById('edit-cancel');
	editCancel.addEventListener('click', function ( event ) {
		event.preventDefault();
		document.getElementsByClassName('edit-dialog')[0].style.display = 'none';
	})
	editSave.addEventListener('click', function ( event ) {
		event.preventDefault();
		var target =event.target;
		var detail = document.getElementsByClassName('edit-dialog')[0]
		var cateName = taskList.getAttribute('cateName');
		var parentCateName = taskList.getAttribute('parentCateName');
		if (!parentCateName) { parentCateName = undefined }
		var taskName = document.getElementsByClassName('details')[0].getElementsByTagName('h4')[0].innerText.trim();
		var cate = findCate (cateName, parentCateName);
		var tasks = findTaskByName (taskName, cate.tasks );
		var form = detail.getElementsByTagName('form')[0];
		
		task = tasks[0];
		task.name = form.task.value;
		task.detail = form.detail.value;
		detail.style.display = 'none';
		syncTasks( parentCateName || cateName );
		updateDetail (taskName, cateName, parentCateName);
	})
	// util 
	function findCate(cateName, parentCateName) {
		var cate = tasks,
			result;
		if (!!parentCateName) {
			for ( var i = 0; i < tasks.length; i++) {
				if (tasks[i].categoryName == parentCateName) {
					cate = tasks[i].childCategories;
					break;
				}
			}
		}
		if (!!cateName) {
			for ( var i = 0; i < cate.length; i++) {
				if (cate[i].categoryName == cateName) {
					result = cate[i];
					break;
				}
			}
		}
		return result;
	}

	function updateTask(cateName, parentCateName) {
		var task = findCate(cateName, parentCateName).tasks;

		// 按时间排序函数
		function compareByDate(obj1,obj2) {
			var a = Number(obj1.date.replace(/-/g,''));
			var b = Number(obj2.date.replace(/-/g,''));
			return a - b;
		}
		task.sort(compareByDate);
		var taskList = document.getElementsByClassName("task-list")[0];
		taskList.setAttribute('cateName', cateName);

		if (!!parentCateName) {
			taskList.setAttribute('parentCateName', parentCateName);
		} else {
			taskList.setAttribute('parentCateName', '');
		}
		taskList.innerHTML = '';
		for (var i = 0; i < task.length; i++) {
			var liDate = document.createElement('li');
			var h4 = document.createElement('h4');
			h4.innerHTML = task[i].date;
			liDate.appendChild(h4);
			for (var j = 0; j < task[i].task.length; j++) {
				var liTask = document.createElement('li');
				liTask.innerHTML = task[i].task[j].name;
				liTask.className = 'task '+task[i].task[j].status;
				liDate.appendChild(liTask);
			}
			taskList.appendChild(liDate);
		}
	}

	function updateCate ( cateName, parentCateName ) {
		category.innerHTML = '';
		for (var i = 0; i < tasks.length; i++) {
			var li = document.createElement("li");
			
			cateA = tasks[i]; // 一级分类
			var h4 = document.createElement('h4');
			h4.innerHTML = '<span class="fa fa-folder"></span> ' + cateA.categoryName + '(' +cateA.childrenNum + ') <span class="close fa fa-times"></span>';
			var ul = document.createElement('ul');
			if (cateA.categoryName == (parentCateName || cateName) ) {
				h4.className = 'active';
				ul.className = 'show';
			}
			for ( var j = 0; j < cateA.childCategories.length; j++) {
				var child = document.createElement("li");
				var cateB = cateA.childCategories[j];  // 二级分类
				if ( cateB.categoryName == cateName) {
					child.className = 'active';
				}
				child.innerHTML = '<span class="fa fa-file-o"></span> ' + cateB.categoryName + '(' +cateB.childrenNum + ') <span class="close fa fa-times"></span>';
				ul.appendChild(child);
			}
			li.appendChild(h4);
			li.appendChild(ul);
			category.appendChild(li);
		}
	}

	function findTaskByName( task, cate ) {
		var result;
		var date;
		for (var i = 0; i < cate.length; i++) {
			for (var j = 0; j < cate[i].task.length; j++){
				if (cate[i].task[j].name === task) {
					date = cate[i].date;
					result = cate[i].task[j];
					break;
				}
			}
			if (!!result) {
				break;
			}
		}
		return [result,date];
	}

	function findTasksByDate( date, cateName, parentCateName ) {
		var cate = findCate(cateName, parentCateName).tasks;
		var result;
		for (var i = 0; i < cate.length; i++) {
			if ( dateIsEqual (cate[i].date, date) ) {
				return cate[i].task;
			}
		}
		return undefined;
	}

	function updateDetail (task, cateName, parentCateName) {
		var cate = findCate(cateName, parentCateName).tasks;
		var arr = findTaskByName(task, cate );
		var result = arr[0];
		var date = arr[1];
		
		var details = document.getElementsByClassName('details')[0];
		var h4 = details.getElementsByTagName('h4')[0];
		var dateDIV = details.getElementsByClassName('date')[0];
		var detail = details.getElementsByClassName('detail')[0];
		h4.innerHTML = result.name || '';
		dateDIV.innerHTML = date || '';
		detail.innerHTML = result.detail || '';
	}

	// 分类项查找父分类
	function findParentCate(cateNode) {
		var parent = cateNode.parentNode.previousElementSibling;
		return parent.nodeName.toLowerCase() == 'h4'? parent.innerText.trim() : undefined;
	}

	// 去掉分类后面的括号
	function getCateName( str ) {
		var tempArr = str.split('(');
		tempArr.splice(tempArr.length-1);
		return tempArr.toString().trim();
	}

	function findCateIndex(cateName, parentCateName) {
		var index = [];
		var cate = tasks
		var parentIndex,
			cateIndex;
		if (!!parentCateName) {
			for ( var i = 0; i < tasks.length; i++) {
				if (tasks[i].categoryName == parentCateName) {
					cate = tasks[i].childCategories;
					parentIndex = i;
					break;
				}
			}
		}
		if (!!cateName) {
			for ( var i = 0; i < cate.length; i++) {
				if (cate[i].categoryName == cateName) {
					cateIndex = i;
					break;
				}
			}
		}
		return [cateIndex, parentIndex];
	}

	// 删除tasks中的分类
	function removeCate(cateName, parentCateName) {
		var index = findCateIndex(cateName, parentCateName);
		var temp = tasks;
		if ( (typeof index[1]).toLowerCase() =='number' ){
			temp = tasks[index[1]];
			var childCategories = temp.childCategories;
			childCategories.splice(index[0], 1);
			temp.tasks = [];
			for (var i = 0; i < childCategories.length; i++) {
				temp.tasks = temp.tasks.concat(childCategories[i].tasks);
			}
		} else {
			tasks.splice(index[0], 1);
		}
	}

	// 增加tasks中的分类
	function addCate ( cateName, parentCateName ) {
		var temp = tasks;
		if(!! parentCateName) {
			temp = findCate( parentCateName );
			temp.childCategories[temp.childCategories.length] = {
																	categoryName: cateName,
																	childrenNum: 0,
																	tasks: []
																};
		} else {
			temp[temp.length] = {
									categoryName: cateName,
									childrenNum: 0,
									childCategories: [],
									tasks: []
								};
		}
	}

	function addTaskToTasks( taskName, date, cateName, parentCateName ) {
		var cate = findCate(cateName, parentCateName);
		if(!!parentCateName) {
			for (var i = 0; i < cate.tasks.length; i++) {
				if ( dateIsEqual (date, cate.tasks[i].date ) ) {
					var task = cate.tasks[i].task;
					task[task.length] = {
											name: taskName,
											status: 'uncomplete',
											detail: ''
										};
					return;
				}
			}
			cate.tasks[cate.tasks.length] = {
												date: date,
												task: [
													{
														name: taskName,
														status: 'uncomplete',
														detail: ''
													}
												]
											};
		} else{
			if (!cate.childCategories[0]) {
				cate.childCategories[0] = {
											"categoryName": "子分类1",
											"childrenNum": "0",
											"tasks": []
										}
			}
			cate = cate.childCategories[0];
			for (var i = 0; i < cate.tasks.length; i++) {
				if ( dateIsEqual (date, cate.tasks[i].date) ) {
					var task = cate.tasks[i].task;
					task[task.length] = {
											name: taskName,
											status: 'uncomplete',
											detail: ''
										};
					return;
				}
			}
			cate.tasks[cate.tasks.length] = {
												date: date,
												task: [
													{
														name: taskName,
														status: 'uncomplete',
														detail: ''
													}
												]
											};
		}
	}

	/*date1,date2: <string> 2015-9-2/2015-09-02*/
	function dateIsEqual (date1, date2) {
		date1 = date1.split('-');
		date2 = date2.split('-');
		for ( var i = 0; i < 3; i++) {
			if ( Number(date1[i]) != Number(date2[i]) ) {
				return false;
			}
		}
		return true;
	}

	function updateTaskStatus ( status, taskName, date, cateName, parentCateName ) {
		var cate = findCate( cateName, parentCateName );
		if (!!parentCateName) {
			for ( var i = 0; i < cate.tasks.length; i++ ) {
				var task = cate.tasks[i];
				if ( dateIsEqual (task.date, date) ) {
					for (var j = 0; j < task.task.length; j++) {
						if ( task.task[j].name == taskName) {
							if (task.task[j].status == 'complete') {
								if (confirm("任务："+taskName + "已完成！点击确定设置为：未完成")) {
									task.task[j].status = 'uncomplete';
								}
								return;
							}
							if (task.task[j].status == 'uncomplete') {
								if (confirm("确定已完成任务："+taskName + "！")) {
									task.task[j].status = 'complete';
								}
								return;
							}
						}
					}
				}
			}
		} else {
			for ( var i = 0; i < cate.childCategories.length; i++ ) {
				var childCate = cate.childCategories[i];
				for ( var j = 0; j < childCate.tasks.length; j++ ) {
					var childTask = childCate.tasks[j];
					if ( dateIsEqual (childTask.date, date) ) {
						for ( var k = 0; k < childTask.task.length; k++) {
							if ( childTask.task[k].name == taskName) {
								if (childTask.task[k].status == 'complete') {
									if (confirm("任务："+taskName + "已完成！点击确定设置为：未完成")) {
										childTask.task[k].status = 'uncomplete';
									}
									return;
								}
								if (childTask.task[k].status == 'uncomplete') {
									if (confirm("确定已完成任务："+taskName + "！")) {
										childTask.task[k].status = 'complete';
									}
									return;
								}
							}
						}
					}
				}
			}
		}
	}
	// 同步父分类和子分类中的任务
	function syncTasks( cateName ) {
		var cate = findCate(cateName);
		var tasks = [];
		var num = 0;
		for ( var i = 0; i < cate.childCategories.length; i++ ) {
			var childNum = 0;
			for (var j = 0; j < cate.childCategories[i].tasks.length; j++ ) {
				tasks[tasks.length] = cate.childCategories[i].tasks[j];
				childNum += cate.childCategories[i].tasks[j].task.length;
			}
			cate.childCategories[i].childrenNum = childNum;
			num += childNum;
		}
		cate.tasks = tasks;
		cate.childrenNum = num;
	}


	// 本地数据存储
	function storeData () {
		localStorage.setItem( 'GTDTasks', JSON.stringify(tasks));
	}
	function getData () {
		return JSON.parse(localStorage.getItem('GTDTasks'));
	}

	setInterval(storeData, 10000);
	window.onunload = storeData;
} ();


