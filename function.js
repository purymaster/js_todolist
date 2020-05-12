let todoList = document.querySelector('#plan'),
	todoListData = [],
	todoListAll = "",
	completeList = document.querySelector('#complete'),
	completeListData = [],
	completeListAll = "",
	controlIdx,
	modifyMode = false;

document.querySelector('form').addEventListener('submit', function (e) {
	e.preventDefault();
	modifyMode ? setModifyList() : addTodoList();
	formInit('focus');
});

document.addEventListener('click', function (e) {
	if (e.target && e.target.classList.contains('modify')) setModifyList();
	if (e.target && e.target.classList.contains('cancel')) modifyCancel();
	if (e.target && e.target.classList.contains('clear')) clearCache();
	if (e.target && e.target.classList.contains('modify_this')) getModifyList(e.target);
	if (e.target && e.target.classList.contains('delete_this')) removeList(e.target);
	if (e.target && e.target.classList.contains('move_this')) moveCompleteList(e.target);
});

function getTodayDate() {
	let date = new Date(),
		month = date.getMonth() + 1,
		day = date.getDate();
	return [
		date.getFullYear(),
		(month > 9 ? '' : '0') + month,
		(day > 9 ? '' : '0') + day
	].join('');
};

function setDate() {
	localStorage['todoDate'] = getTodayDate();
};

function setCache(todoArr = [], completeArr = []) {
	localStorage['todoList'] = JSON.stringify(todoArr);
	localStorage['completeList'] = JSON.stringify(completeArr);
	setDate();
};

function getCache() {
	if (localStorage['todoDate'] && getTodayDate() !== localStorage['todoDate']) {
		if (localStorage['todoList'] !== "" || localStorage['todoList'] !== "[]") {
			alert("완료하지 않은 일 : \n\n" + JSON.parse(localStorage['todoList']).join('\n'));
		};
		clearCache();
	};
	drawList();
};

function clearCache() {
	localStorage['todoList'] = "";
	localStorage['completeList'] = "";
	localStorage['todoDate'] = getTodayDate();
	location.reload();
};

function formInit(val) {
	if (val) document.querySelector('#title').focus();
	document.querySelector('#title').value = "";
};

function setTodoList(arr) {
	let len = arr.length;
	todoListAll = "";
	for (let i = 0; i < len; i++) {
		let title = arr[i];
		const todoListTemplate = `
			<li>
				<p>${title}</p>
				<button type="button" class="modify_this">수정</button>
				<button type="button" class="delete_this">삭제</button>
				<button type="button" class="move_this">완료</button>
			</li>
		`;
		todoListAll += todoListTemplate;
	};
	return todoListAll;
};

function setCompleteList(arr) {
	let len = arr.length;
	completeListAll = "";
	for (let i = 0; i < len; i++) {
		let title = arr[i];
		const completeListTemplate = `
			<li>
				<p>${title}</p>
			</li>
		`;
		completeListAll += completeListTemplate;
	};
	return completeListAll;
};

function addTodoList() {
	let listTitle = document.querySelector('#title').value;
	if (listTitle.trim() === "") {
		alert('내용을 입력해주시길 바랍니다.');
		formInit('focus');
		return false;
	};
	todoListData.push(listTitle);
	todoList.innerHTML = setTodoList(todoListData);
	setCache(todoListData, completeListData);
	formInit('focus');
};

function getControlTarget(obj) {
	return Array.from(obj.parentNode.parentNode.children).indexOf(obj.parentNode);
};

function getModifyList(obj) {
	controlIdx = getControlTarget(obj);
	document.querySelector('#title').value = obj.parentNode.querySelector('p').textContent;
	document.querySelector('#title').focus();
	modifyMode = true;
	obj.parentNode.classList.add('on');
	document.querySelector('body').classList.add('mod_ctr');
};

function setModifyList() {
	alert('수정되었습니다.');
	let title = document.querySelector('#title').value;
	todoListData.splice(controlIdx, 1, title)
	todoList.innerHTML = setTodoList(todoListData);
	setCache(todoListData, completeListData);
	formInit();
	modifyMode = false;
	document.querySelector('body').classList.remove('mod_ctr');
	for (let item of document.querySelectorAll('.list li')) {
		item.classList.remove('on');
	};
};

function modifyCancel() {
	controlIdx = null;
	formInit();
	modifyMode = false;
	document.querySelector('body').classList.remove('mod_ctr');
	for (let item of document.querySelectorAll('.list li')) {
		item.classList.remove('on');
	};
};

function removeList(obj) {
	if (!confirm('삭제하시겠습니까?')) return false;
	alert('삭제되었습니다.');
	controlIdx = getControlTarget(obj);
	todoListData.splice(controlIdx, 1);
	obj.parentElement.remove();
	setCache(todoListData, completeListData);
	drawList();
	formInit();
};

function moveCompleteList(obj) {
	if (!confirm('완료하시겠습니까?')) return false;
	alert('완료되었습니다.');
	controlIdx = getControlTarget(obj);
	let complete = todoListData.splice(controlIdx, 1).toString();
	obj.parentElement.remove();
	completeListData.push(complete);
	completeList.innerHTML = setCompleteList(completeListData);
	setCache(todoListData, completeListData);
	drawList();
	formInit();
};

function drawList() {
	if (!localStorage['todoList'] || localStorage['todoList'] === "[]") {
		todoListData = [];
		todoList.innerHTML = `<li class="blank">오늘 해야할 일이 없습니다.</li>`;
	} else {
		todoListData = JSON.parse(localStorage['todoList']);
		todoList.innerHTML = setTodoList(todoListData);
	};
	if (!localStorage['completeList'] || localStorage['completeList'] === "[]") {
		completeListData = [];
		completeList.innerHTML = `<li class="blank">오늘 완료한 일이 없습니다.</li>`;
	} else {
		completeListData = JSON.parse(localStorage['completeList']);
		completeList.innerHTML = setCompleteList(completeListData);
	};
};

(function () {
	getCache();
	formInit('focus');
})();