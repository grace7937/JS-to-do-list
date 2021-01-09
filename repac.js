const TODO_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

const STATUS_MODE = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

const TEXT_MODE = {
  READ: 'read',
  WRITE: 'write',
};

// STATE
let todos = [];
let currentStatusMode = STATUS_MODE.ALL;

// DOM Object
const mainCheckBox = document.getElementById('main-check-box');
const additionInput = document.getElementById('addition-input');
const todoList = document.getElementById('todo-list');
const allBtn = document.querySelector('#all-btn');
const activeBtn = document.querySelector('#active-btn');
const completedBtn = document.querySelector('#completed-btn');
const clearCompleteBtn = document.querySelector('#clear-btn');
const activeAccount = document.querySelector('#active-count');

mainCheckBox.addEventListener('change', toggleAllTodoHandler);
additionInput.addEventListener('keydown', addToDoHandler);
clearCompleteBtn.addEventListener('click', clearCompletedTodoHander);
allBtn.addEventListener('click', () => changeStatustMode(STATUS_MODE.ALL));
activeBtn.addEventListener('click', () =>
  changeStatustMode(STATUS_MODE.ACTIVE)
);
completedBtn.addEventListener('click', () =>
  changeStatustMode(STATUS_MODE.COMPLETED)
);
KJ;

// HANDLER
function toggleAllTodoHandler() {
  const isAllCompleted = todos.every(
    (todo) => todo.status === TODO_STATUS.COMPLETED
  );

  todos = isAllCompleted
    ? todos.map((todo) => ({ ...todo, status: TODO_STATUS.ACTIVE }))
    : todos.map((todo) => ({ ...todo, status: TODO_STATUS.COMPLETED }));

  render(todos);
}

function addToDoHandler(e) {
  const todoText = e.target.value;
  const isValidTodoText = e.key === 'Enter' && todoText !== '';

  if (isValidTodoText) {
    addTodo(todoText);
    additionInput.value = '';

    render(todos);
  }
}

function deleteTodoHandler(todo) {
  todos = todos.filter(({ id }) => id !== todo.id);

  render(todos);
}

function changeTodoStatusHandler(todoId) {
  todos = todos.map((todo) =>
    todo.id === todoId
      ? {
          ...todo,
          status:
            todo.status === TODO_STATUS.ACTIVE
              ? TODO_STATUS.COMPLETED
              : TODO_STATUS.ACTIVE,
        }
      : todo
  );

  render(todos);
}

function changeReadModeHandler(todoId) {
  todos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, textMode: TEXT_MODE.READ } : todo
  );

  render(todos);
}

function changeWriteModeHandler(todoId) {
  todos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, textMode: TEXT_MODE.WRITE } : todo
  );

  render(todos);
}

function clearCompletedTodoHander() {
  todos = todos.filter((todo) => todo.status !== TODO_STATUS.COMPLETED);

  render(todos);
}

function changeStatustMode(statusMode) {
  currentStatusMode = statusMode;

  render(todos);
}

// METHOD
const addTodo = (text) => {
  const todo = {
    id: getNewTodoID(todos),
    text: text,
    textMode: TEXT_MODE.READ,
    status: TODO_STATUS.ACTIVE,
  };

  todos.push(todo);
};

// MAKE ELEMENT
const getCheckBox = (todo) => {
  const checkBox = document.createElement('input');

  checkBox.type = 'checkbox';
  checkBox.id = `todo-checkbox-${todo.id}`;
  checkBox.className = 'check-box';
  checkBox.checked = todo.status === TODO_STATUS.COMPLETED;
  checkBox.addEventListener('change', () => changeTodoStatusHandler(todo.id));

  return checkBox;
};

const getCheckBoxIcon = (todo) => {
  const checkboxIcon = document.createElement('label');

  checkboxIcon.innerHTML =
    todo.status === TODO_STATUS.COMPLETED
      ? '<i class="far fa-check-circle checked"></i>'
      : '<i class="far fa-circle"></i>';
  checkboxIcon.htmlFor = `todo-checkbox-${todo.id}`;

  return checkboxIcon;
};

const getText = (todo) => {
  const text = document.createElement('span');

  text.className = todo.status; // ??
  text.innerText = todo.text;
  text.addEventListener('dblclick', () => changeWriteModeHandler(todo.id));

  return text;
};

const getDeleteButton = (todo) => {
  const deleteButton = document.createElement('button');

  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delete-btns';
  deleteButton.addEventListener('click', () => deleteTodoHandler(todo));
  deleteButton.innerHTML = '<i class="fas fa-times"></i>';

  return deleteButton;
};

const getWriteInput = (todo) => {
  const writeInput = document.createElement('input');

  writeInput.value = todo.text;
  writeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      todos = todos.map((_todo) =>
        _todo.id === todo.id ? { ..._todo, text: writeInput.value } : _todo
      );
      changeReadModeHandler(todo.id);
    }
  });

  return writeInput;
};

const render = (todos) => {
  todoList.innerHTML = '';

  todos = getTodosByStatusMode(currentStatusMode, todos);

  todos.forEach((todo) => {
    const checkBox = getCheckBox(todo);
    const checkboxIcon = getCheckBoxIcon(todo);
    const text = getText(todo);
    const writeInput = getWriteInput(todo);
    const deleteButton = getDeleteButton(todo);

    const todoWrapper = document.createElement('li');
    todoWrapper.className = 'todo';
    todoWrapper.id = todo.id;
    todoWrapper.appendChild(checkBox);
    todoWrapper.appendChild(checkboxIcon);

    todo.textMode === TEXT_MODE.READ
      ? todoWrapper.appendChild(text)
      : todoWrapper.appendChild(writeInput);
    todoWrapper.appendChild(deleteButton);

    todoList.appendChild(todoWrapper);
  });

  activeAccount.innerHTML = `${getActiveTodoCount(todos)} items left`;
};

// UTIL
const getNewTodoID = (todos) => {
  return todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
};

const getActiveTodoCount = (todos) => {
  return todos.filter((todo) => todo.status === TODO_STATUS.ACTIVE).length;
};

const getTodosByStatusMode = (statusMode, todos) => {
  if (statusMode === STATUS_MODE.ALL) {
    return todos;
  }
  return todos.filter((todo) => todo.status === statusMode);
};

const init = () => {
  currentStatusMode = localStorage.getItem('statusMode') || STATUS_MODE.ALL;
  todos = JSON.parse(localStorage.getItem('todos')) || [];

  render(todos);

  window.onbeforeunload = () => {
    localStorage.setItem('statusMode', currentStatusMode);
    localStorage.setItem('todos', JSON.stringify(todos));
  };
};
init();
