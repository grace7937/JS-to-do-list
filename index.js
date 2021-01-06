// constants
const TODO_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

const STATUS_MODE = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

// state
let todos = [];
let statusMode = STATUS_MODE.ALL;

// DOM Ref
const mainCheckBox = document.getElementById('main-check-box');
const additionInput = document.getElementById('addition-input');
const todoList = document.getElementById('todo-list');

const getID = () => {
  return todos.length === 0 
    ? 1 
    : todos[todos.length - 1].id + 1
}

const addTodo = (title) => {
  const todoItem = {
    id: getID(),
    title: title,
    status: TODO_STATUS.ACTIVE,
  };

  todos.push(todoItem);
  
  additionInput.value = '';

  filterBeforeRender();
};

const deleteList = (event) => {
  const deletedList = todos.filter(
    (list) => Number(event.target.parentNode.id) !== list.id
  );
  todos = deletedList;
  filterBeforeRender();
  countActiveLength();
};

const changeStatus = (event) => {
  const { parentNode, checked } = event.target;
  const changedStatusTodos = todos.map((list) => {
    if (Number(parentNode.id) === list.id) {
      return { ...list, status: checked ? 'completed' : 'active' };
    } else {
      return list;
    }
  });
  todos = changedStatusTodos;
  resetToggleBtn();
  filterBeforeRender();
  countActiveLength();
};

const changeInputToSpan = () => {
  const { value, parentNode } = event.target;
  const replacedSpan = document.createElement('span');
  replacedSpan.innerText = value;
  parentNode.replaceChild(replacedSpan, event.target);

  const changedTitleTodos = todos.map((list) =>
    Number(parentNode.id) === list.id ? { ...list, title: value } : list
  );
  console.log(changedTitleTodos);
  todos = changedTitleTodos;
};

const changeSpanToInput = (event) => {
  const { innerText, parentNode } = event.target;
  const replacedInput = document.createElement('input');
  replacedInput.value = innerText;
  parentNode.replaceChild(replacedInput, event.target);

  replacedInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      console.log('hi');
      changeInputToSpan(e);
    }
  });
};

const render = (todos) => {
  todoList.innerHTML = '';

  todos.map((list) => {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'checkBox';
    checkBox.checked = list.status === TODO_STATUS.COMPLETED ? true : false;
    checkBox.addEventListener('change', changeStatus);

    const wrapperLi = document.createElement('li');
    wrapperLi.id = list.id;

    const titleSpan = document.createElement('span');
    titleSpan.innerText = list.title;

    titleSpan.addEventListener('dblclick', (event) => changeSpanToInput(event));

    const DeleteButton = document.createElement('button');
    DeleteButton.innerText = 'Delete';
    DeleteButton.classList.add('button');
    DeleteButton.addEventListener('click', deleteList);

    wrapperLi.appendChild(checkBox);
    wrapperLi.appendChild(titleSpan);
    wrapperLi.appendChild(DeleteButton);

    todoList.appendChild(wrapperLi);

    // active count innerHTML = count + '어쩌구 저쩌구';
  });
};

const onToggleBtn = () => {
  const { checked } = event.target;
  const allCheckedTodos = todos.map((list) => ({
    ...list,
    status: checked ? TODO_STATUS.COMPLETED : TODO_STATUS.ACTIVE,
  }));
  todos = allCheckedTodos;
  filterBeforeRender();
  countActiveLength();
};

additionInput.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && e.target.value !== '') {
    addTodo(e.target.value);
  }
});

mainCheckBox.addEventListener('change', onToggleBtn);

//----------buttom_bar-----------------
const allBtn = document.querySelector('#all-btn');
const activeBtn = document.querySelector('#active_Btn');
const completedBtn = document.querySelector('#completed_Btn');

const buttomBar = document.querySelector('#buttom_bar');
const statusMessage = document.createElement('span');
statusMessage.innerText = '0 items left   '; // 이거는 나중에 간격을 css로 주기바람
buttomBar.insertBefore(statusMessage, allBtn);

const saveStatusInLocalStorage = () => {
  localStorage.setItem('status', statusMode);
};

const filterBeforeRender = () => {
  if (statusMode === STATUS_MODE.ALL) {
    return render(todos);
  }

  const filteredTodo = todos.filter((list) => list.status === statusMode);
  
  render(filteredTodo);
  saveTodos();
  saveStatusInLocalStorage();
};

const countActiveLength = () => {
  const activeArray = todos.filter((list) => list.status === TODO_STATUS.ACTIVE);
  const activeCount = activeArray.length;

  // activeCount 이 친구를 상태로 두어야 한다.

  statusMessage.innerText = activeCount + 'items left';
};

allBtn.addEventListener('click', () => {
  statusMode = '';
  filterBeforeRender();
});
activeBtn.addEventListener('click', () => {
  statusMode = TODO_STATUS.ACTIVE;
  filterBeforeRender();
});
completedBtn.addEventListener('click', () => {
  statusMode = TODO_STATUS.COMPLETED;
  filterBeforeRender();
});

const saveTodos = () => {
  localStorage.clear(); // 있는게 맞나...?
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

const getIsAllActive = () => {
  return todos.every(({ status }) => status == TODO_STATUS.ACTIVE);
};

const getStatusFromLocalStorage = () => {
  const receivedStatus = localStorage.getItem('status');
  statusMode = receivedStatus;
};

const init = () => {
  getStatusFromLocalStorage();
  getTodos();
  resetToggleBtn();
};
init();