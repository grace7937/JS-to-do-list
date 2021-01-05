const mainCheckBox = document.getElementById('mainCheckBox');
let todos = [];
let statusValue = '';
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
  const changedStatusTodos = todos.map((list) => {
    if (Number(event.target.parentNode.id) == list.id) {
      if (event.target.checked == true) {
        return { ...list, status: 'completed' };
      } else {
        return { ...list, status: 'active' };
      }
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

const checkAll = () => {
  const allCheckedTodos = todos.map((list) => {
    return { ...list, status: 'completed' };
  });
  todos = allCheckedTodos;
  refineTodos(statusValue);
};

const uncheckAll = () => {
  const allUncheckedTodos = todos.map((list) => {
    return { ...list, status: 'active' };
  });
  todos = allUncheckedTodos;
  refineTodos(statusValue);
};

const onToggleBtn = (event) => {
  if (event.target.checked == true) {
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

const refineTodos = (status) => {
  if (status == 'active') {
    let activeFilter = todos.filter((list) => {
      return list.status == 'active';
    });
    console.log(activeFilter);
    render(activeFilter);
  } else if (status == 'completed') {
    let completedFilter = todos.filter((list) => {
      return list.status == 'completed';
    });
    console.log(completedFilter);
    render(completedFilter);
  } else {
    console.log(todos);
    render(todos);
  }
};

allBtn.addEventListener('click', () => {
  statusValue = 'all';
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
