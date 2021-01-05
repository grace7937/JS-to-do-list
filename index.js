const mainCheckBox = document.getElementById('mainCheckBox');
let todos = [];
let statusValue = '';
const input = document.getElementById('input'); // 변수명 교체
const ul = document.getElementById('ul'); // 변수명 교체

const addList = (title) => {
  const todoId = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
  const todoItem = {
    id: todoId,
    status: 'active',
    title: title,
  };
  todos.push(todoItem);
  input.value = '';
  refineTodos(statusValue);
};

const deleteList = (event) => {
  const deletedList = todos.filter(
    (list) => Number(event.target.parentNode.id) !== list.id
  );
  todos = deletedList;
  refineTodos(statusValue);
};

const changeStatus = (event) => {
  const {parentNode, checked} = event.target;
  const changedStatusTodos = todos.map((list) => {
    if (Number(parentNode.id) === list.id) {
      return {...list, status: checked ? 'completed' : 'active'}
    } else {
      return list;
    }
  });
  todos = changedStatusTodos;
  refineTodos(statusValue);
};

const render = (todos) => {
  ul.innerHTML = '';
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

    const button = document.createElement('button');
    button.innerText = 'Delete';
    button.classList.add('button');
    button.addEventListener('click', deleteList);

    wrapperLi.appendChild(checkBox);
    wrapperLi.appendChild(titleSpan);
    wrapperLi.appendChild(button);

    ul.appendChild(wrapperLi);
  });
};

//checkAll, uncheckAll 두 개의 함수를 하나로 만들고 onToggleBtn 함수에 넣으면 깔끔할 듯
const checkAll = () => {
  const allCheckedTodos = todos.map((list) => ({ ...list, status: 'completed' }));
  todos = allCheckedTodos;
  refineTodos(statusValue);
};

const uncheckAll = () => {
  const allUncheckedTodos = todos.map((list) => ({ ...list, status: 'active' }));
  todos = allUncheckedTodos;
  refineTodos(statusValue);
};

const onToggleBtn = (event) => {
  if (event.target.checked) {
    checkAll();
  } else {
    uncheckAll();
  }
};

input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && e.target.value !== '') {
    addList(e.target.value);
  }
});

mainCheckBox.addEventListener('change', onToggleBtn);

//----------buttom_bar-----------------

const buttomBar = document.querySelector('#buttom_bar');

const statusMessage = document.createElement('span');
const allBtn = document.createElement('button');
const activeBtn = document.createElement('button');
const completedBtn = document.createElement('button');

statusMessage.innerText = '? items left   ';
allBtn.innerText = 'All';
activeBtn.innerText = 'Active';
completedBtn.innerText = 'Completed';

buttomBar.appendChild(statusMessage);
buttomBar.appendChild(allBtn);
buttomBar.appendChild(activeBtn);
buttomBar.appendChild(completedBtn);

// 함수명을 바꿔줬으면 함.
const refineTodos = (status) => {
// if, else if에서 중복을 줄이기 바람 (하나로 만들기)
  if (status === 'active') {
    let activeFilter = todos.filter((list) => {
      return list.status === 'active';
    });
    render(activeFilter);
  } else if (status === 'completed') {
    let completedFilter = todos.filter((list) => {
      return list.status === 'completed';
    });
    render(completedFilter);
  } else {
    render(todos);
  }
};

// all, active, completed 버튼은 html로 만들고 세개 따로 클릭 이벤트를 달아서 콜백함수를 실행시키는 것이 아니라
//하나의 함수를 실행시켜서 동작하도록 만들기
allBtn.addEventListener('click', () => {
  //statusValue = 'all'; 없어도 될듯
  refineTodos(statusValue);
});
activeBtn.addEventListener('click', () => {
  statusValue = 'active';
  refineTodos(statusValue);
});
completedBtn.addEventListener('click', () => {
  statusValue = 'completed';
  refineTodos(statusValue);
});
