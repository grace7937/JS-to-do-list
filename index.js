const mainCheckBox = document.getElementById('mainCheckBox');
let todos = [];
let statusValue = '';
const textBox = document.getElementById('input');
const listWrapper = document.getElementById('ul');

const addList = (title) => {
  const todoId = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
  const todoItem = {
    id: todoId,
    status: 'active',
    title: title,
  };
  todos.push(todoItem);
  textBox.value = '';
  filterBeforeRender();
  countActiveLength();
  resetToggleBtn();
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
  listWrapper.innerHTML = '';

  todos.map((list) => {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'checkBox';
    checkBox.checked = list.status === 'completed' ? true : false;
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

    listWrapper.appendChild(wrapperLi);
  });
};

const onToggleBtn = () => {
  const { checked } = event.target;
  const allCheckedTodos = todos.map((list) => ({
    ...list,
    status: checked ? 'completed' : 'active',
  }));
  todos = allCheckedTodos;
  filterBeforeRender();
  countActiveLength();
};

textBox.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && e.target.value !== '') {
    addList(e.target.value);
  }
});

mainCheckBox.addEventListener('change', onToggleBtn);

//----------buttom_bar-----------------
const allBtn = document.querySelector('#all_Btn');
const activeBtn = document.querySelector('#active_Btn');
const completedBtn = document.querySelector('#completed_Btn');

const buttomBar = document.querySelector('#buttom_bar');
const statusMessage = document.createElement('span');
statusMessage.innerText = '0 items left   '; // 이거는 나중에 간격을 css로 주기바람
buttomBar.insertBefore(statusMessage, allBtn);

const saveStatusInLocalStorage = () => {
  localStorage.setItem('status', statusValue);
};

const filterBeforeRender = () => {
  if (!statusValue) {
    render(todos);
    return;
  }
  let filteredTodo = todos.filter((list) => list.status === statusValue);
  render(filteredTodo);
  saveTodos();
  saveStatusInLocalStorage();
};

const countActiveLength = () => {
  // 여기도 {}, return 없애기 -> 통일감있게 만들기 위해서 시키는 것임
  let activeArray = todos.filter((list) => list.status === 'active');
  let activeCount = activeArray.length;
  statusMessage.innerText = activeCount + 'items left';
};

allBtn.addEventListener('click', () => {
  statusValue = '';
  filterBeforeRender();
});
activeBtn.addEventListener('click', () => {
  statusValue = 'active';
  filterBeforeRender();
});
completedBtn.addEventListener('click', () => {
  statusValue = 'completed';
  filterBeforeRender();
});

const saveTodos = () => {
  localStorage.clear();
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

const resetToggleBtn = () => {
  const truthyFalsy = todos.every((list) => list.status == 'active');
  truthyFalsy ? (mainCheckBox.checked = false) : (mainCheckBox.checked = true);
};

const getStatusFromLocalStorage = () => {
  const receivedStatus = localStorage.getItem('status');
  statusValue = receivedStatus;
};

const init = () => {
  getStatusFromLocalStorage();
  getTodos();
  resetToggleBtn();
};
init();
