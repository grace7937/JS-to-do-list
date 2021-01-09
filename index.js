const TODO_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

const STATUS_MODE = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

let todos = [];
let statusMode = 'all';

const mainCheckBox = document.getElementById('main-check-box');
const additionInput = document.getElementById('addition-input');
const todoList = document.getElementById('todo-list');
const allBtn = document.querySelector('#all-btn');
const activeBtn = document.querySelector('#active-btn');
const completedBtn = document.querySelector('#completed-btn');
const buttomBar = document.querySelector('#buttom_bar');
const statusMessage = document.createElement('span');
const clearCompleteBtn = document.querySelector('#clear-btn');
statusMessage.className = 'active-count';

const getID = () => {
  return todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
};

const addTodo = (title) => {
  const todoItem = {
    title: title,
    id: getID(),
    status: TODO_STATUS.ACTIVE,
  };

  todos.push(todoItem);
  additionInput.value = '';
  filterBeforeRender();
};

const deleteList = (event) => {
  const deletedList = todos.filter(
    (todo) => Number(event.target.parentNode.parentNode.id) !== todo.id
  );
  todos = deletedList;
  filterBeforeRender();
};

const changeStatus = (event) => {
  const { parentNode, checked } = event.target;
  const changedStatusTodos = todos.map((todo) => {
    if (Number(parentNode.id) === todo.id) {
      return { ...todo, status: checked ? 'completed' : 'active' };
    } else {
      return todo;
    }
  });
  todos = changedStatusTodos;

  filterBeforeRender();
};

const changeInputToSpan = () => {
  const { value, parentNode } = event.target;
  const replacedSpan = document.createElement('span');
  replacedSpan.addEventListener('dblclick', changeSpanToInput);
  replacedSpan.innerText = value;
  parentNode.replaceChild(replacedSpan, event.target);

  const changedTitleTodos = todos.map((todo) =>
    Number(parentNode.id) === todo.id ? { ...todo, title: value } : todo
  );
  todos = changedTitleTodos;
};

const changeSpanToInput = (event) => {
  const { innerText, parentNode } = event.target;
  const replacedInput = document.createElement('input');
  replacedInput.value = innerText;
  parentNode.replaceChild(replacedInput, event.target);

  replacedInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      changeInputToSpan(e);
    }
  });
};

const clearCompletedTodo = () => {
  const isAllCompleted = todos.filter((todo) => todo.status !== 'completed');

  todos = isAllCompleted;
  filterBeforeRender();
};

clearCompleteBtn.addEventListener('click', clearCompletedTodo);

const render = (todos) => {
  todoList.innerHTML = '';
  todos.map((todo) => {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = 'for-' + todo.id;
    checkBox.className = 'check-box';
    checkBox.checked = todo.status === TODO_STATUS.COMPLETED ? true : false;
    checkBox.addEventListener('change', changeStatus);

    const checkboxIcon = document.createElement('label');
    checkboxIcon.innerHTML =
      todo.status === 'completed'
        ? '<i class="far fa-check-circle checked"></i>'
        : '<i class="far fa-circle"></i>';
    checkboxIcon.htmlFor = 'for-' + todo.id;

    const wrapperLi = document.createElement('li');
    wrapperLi.className = 'todo';
    wrapperLi.id = todo.id;

    const titleSpan = document.createElement('span');
    titleSpan.className = todo.status;
    titleSpan.innerText = todo.title;

    titleSpan.addEventListener('dblclick', (event) => changeSpanToInput(event));

    const DeleteButton = document.createElement('button');
    DeleteButton.innerText = 'Delete';
    DeleteButton.className = 'delete-btns';
    DeleteButton.addEventListener('click', deleteList);
    DeleteButton.innerHTML = '<i class="fas fa-times"></i>';

    statusMessage.innerText = '0 items left   ';
    buttomBar.insertBefore(statusMessage, allBtn);

    wrapperLi.appendChild(checkBox);
    wrapperLi.appendChild(checkboxIcon);
    wrapperLi.appendChild(titleSpan);
    wrapperLi.appendChild(DeleteButton);

    todoList.appendChild(wrapperLi);
  });
  countActiveLength();
  isAllChecked();
  saveTodos();
};

const onToggleBtn = () => {
  const { checked } = event.target;
  const allCheckedTodos = todos.map((todo) => ({
    ...todo,
    status: checked ? 'completed' : 'active',
  }));
  todos = allCheckedTodos;
  filterBeforeRender();
};

additionInput.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && e.target.value !== '') {
    addTodo(e.target.value);
  }
});

mainCheckBox.addEventListener('change', onToggleBtn);

const saveStatusInLocalStorage = () => {
  localStorage.setItem('status', statusMode);
};

const filterBeforeRender = () => {
  if (statusMode === STATUS_MODE.ALL) {
    render(todos);
  } else {
    let filteredTodo = todos.filter((todo) => todo.status === statusMode);
    render(filteredTodo);
  }

  saveStatusInLocalStorage();
};

const countActiveLength = () => {
  let activeArray = todos.filter((todo) => todo.status === TODO_STATUS.ACTIVE);
  let activeCount = activeArray.length;
  statusMessage.innerText = activeCount + 'items left';
};

allBtn.addEventListener('click', () => {
  statusMode = 'all';
  filterBeforeRender();
});
activeBtn.addEventListener('click', () => {
  statusMode = 'active';
  filterBeforeRender();
});
completedBtn.addEventListener('click', () => {
  statusMode = 'completed';
  filterBeforeRender();
});

const saveTodos = () => {
  localStorage.setItem('user', JSON.stringify(todos));
};

const getTodos = () => {
  const receivedTodos = JSON.parse(localStorage.getItem('user'));

  if (receivedTodos) {
    todos = receivedTodos;
    filterBeforeRender(receivedTodos);
    countActiveLength();
  } else {
    localStorage.setItem('user', JSON.stringify(todos));
  }
};

const isAllChecked = () => {
  const isAllChecked = todos.every((todo) => todo.status === 'completed');
  isAllChecked ? (mainCheckBox.checked = true) : (mainCheckBox.checked = false);

  console.log(isAllChecked);
  const mainCheckboxIcon = document.querySelector('#main-checkbox-icon');
  if (isAllChecked === true) {
    mainCheckboxIcon.classList.add('mainCheckbox-checked');
  } else {
    mainCheckboxIcon.classList.remove('mainCheckbox-checked');
  }
};

const getStatusFromLocalStorage = () => {
  if (statusMode === null) {
    statusMode = 'all';
    return;
  }
  const receivedStatus = localStorage.getItem('status');
  statusMode = receivedStatus;
};

const init = () => {
  getStatusFromLocalStorage();
  getTodos();
  isAllChecked();
};
init();
