const input = document.getElementById('input');
const addBtn = document.getElementById('button');
const list = document.getElementById('list');

const addList = () => {
  const newList = document.createElement('li');
  newList.innerText = input.value;
  list.appendChild(newList);

  input.value = '';

  makeDeleteBtn(newList);
  // alertNewList();
};

// addBtn.addEventListener('click', addList);
input.addEventListener('keydonw', addList);

const makeDeleteBtn = function (newElement) {
  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'delete';
  newElement.appendChild(deleteBtn);
  deleteBtn.addEventListener('click', onDelete);
};

const alertNewList = () => {
  alert(input.value + ' 항목이 새로 추가됐습니다.');
};

const onDelete = (event) => {
  const parentTag = event.target.parentNode;
  list.removeChild(parentTag);
};

//  const command = function(input) {
//  const taskList = {};
//  const inputArray = input.split('$');

//     inputArray[0] == 'add' ? addvalue(inputArray[1]) :
//     inputArray[0] == 'show' ? showStaus() :
//     inputArray[0] == 'update'? update();

// };

// const addValue = function(){
//     this.taskList.id = 'lenght?';
//     this.taskList.task = '';
//     this.taskList.status = 'todo';

// };

// const showStatus = function(){};

// const update = function(){};
