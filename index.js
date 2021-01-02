const mainCheckBox = document.getElementById('mainCheckBox');
let todos = [];
const input = document.getElementById('input');
const ul = document.getElementById('ul');

const addList = (title) => {
  const todoId = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
  const todoItem = {
    id: todoId,
    status: 'active',
    title: title,
  };
  todos.push(todoItem);
  input.value = '';
  console.log('todos', todos);
  render(todos);
};

const deleteList = (event) => {
  const resultOfDelete = todos.filter(
    (cv) => Number(event.target.parentNode.id) !== cv.id
  );
  todos = resultOfDelete;
  render(resultOfDelete);
};

const changeStatus = (event) => {
  const resultOfChangeStatus = todos.map((cv) => {
    if (Number(event.target.parentNode.id) == cv.id) {
      if (cv.status == 'active') {
        cv.status = 'completed';
      } else if (cv.status == 'completed') {
        cv.status = 'active';
      }
      console.log(cv);
      return cv;
    }
  });
  console.log(resultOfChangeStatus);
};

const render = (todoList) => {
  ul.innerHTML = '';
  todoList.map((cv) => {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'checkBox';
    checkBox.addEventListener('change', changeStatus);

    const wrapperLi = document.createElement('li');
    wrapperLi.id = cv.id;

    const titleSpan = document.createElement('span');
    titleSpan.innerText = cv.title;

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

const checkAll = () => {
  const newTodos = todos.map((cv) => {
    cv.status = 'completed';
    return cv;
  });

  todos = newTodos;
};

const unchekAll = () => {
  const newTodos = todos.map((cv) => {
    cv.status = 'active';
    return cv;
  });
};

const onToggle = () => {
  console.log(todos);
  if ((document.getElementById('mainCheckBox').checked = true)) {
    checkAll();
  } else if ((document.getElementById('mainCheckBox').checked = false)) {
    uncheckall();
  }
};

input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13 && e.target.value !== '') {
    addList(e.target.value);
  }
});

mainCheckBox.addEventListener('change', onToggle);
