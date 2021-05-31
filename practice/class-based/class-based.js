class TodoList {
  TODO_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
  };

  STATUS_MODE = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed',
  };

  TEXT_MODE = {
    READ: 'read',
    WRITE: 'write',
  };

  // STATE
  todos = [];
  currentStatusMode = this.STATUS_MODE.ALL;

  constructor() {
    this.mainCheckBox = document.getElementById('main-check-box');
    this.additionInput = document.getElementById('addition-input');
    this.todoList = document.getElementById('todo-list');
    this.allBtn = document.querySelector('#all-btn');
    this.activeBtn = document.querySelector('#active-btn');
    this.completedBtn = document.querySelector('#completed-btn');
    this.clearCompleteBtn = document.querySelector('#clear-btn');
    this.activeAccount = document.querySelector('#active-count');

    // DOM Object
    this.mainCheckBox.addEventListener('change', this.toggleAllTodoHandler);
    this.additionInput.addEventListener('keydown', this.addToDoHandler);
    this.clearCompleteBtn.addEventListener(
      'click',
      this.clearCompletedTodoHander
    );
    this.allBtn.addEventListener('click', () =>
      this.changeStatustMode(STATUS_MODE.ALL)
    );

    this.activeBtn.addEventListener('click', () =>
      this.changeStatustMode(STATUS_MODE.ACTIVE)
    );
    completedBtn.addEventListener('click', () =>
      this.changeStatustMode(STATUS_MODE.COMPLETED)
    );
  }

  // HANDLER
  toggleAllTodoHandler() {
    const isAllCompleted = todos.every(
      (todo) => todo.status === TODO_STATUS.COMPLETED
    );

    todos = isAllCompleted
      ? todos.map((todo) => ({ ...todo, status: TODO_STATUS.ACTIVE }))
      : todos.map((todo) => ({ ...todo, status: TODO_STATUS.COMPLETED }));

    render(todos);
  }

  addToDoHandler(e) {
    console.log('hi');
    const todoText = e.target.value;
    const isValidTodoText = e.key === 'Enter' && todoText !== '';

    if (isValidTodoText) {
      addTodo(todoText);
      additionInput.value = '';

      render(todos);
    }
  }

  deleteTodoHandler(todo) {
    todos = todos.filter(({ id }) => id !== todo.id);

    render(todos);
  }

  changeTodoStatusHandler(todoId) {
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

  changeReadModeHandler(todoId) {
    todos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, textMode: TEXT_MODE.READ } : todo
    );

    render(todos);
  }

  changeWriteModeHandler(todoId) {
    todos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, textMode: TEXT_MODE.WRITE } : todo
    );

    render(todos);
  }

  clearCompletedTodoHander() {
    todos = todos.filter((todo) => todo.status !== TODO_STATUS.COMPLETED);

    render(todos);
  }

  changeStatustMode(statusMode) {
    currentStatusMode = statusMode;

    render(todos);
  }

  // METHOD
  addTodo(text) {
    const todo = {
      id: getNewTodoID(todos),
      text: text,
      textMode: TEXT_MODE.READ,
      status: TODO_STATUS.ACTIVE,
    };

    todos.push(todo);
  }

  // MAKE ELEMENT
  getCheckBox(todo) {
    const checkBox = document.createElement('input');

    checkBox.type = 'checkbox';
    checkBox.id = `todo-checkbox-${todo.id}`;
    checkBox.className = 'check-box';
    checkBox.checked = todo.status === TODO_STATUS.COMPLETED;
    checkBox.addEventListener('change', () =>
      this.changeTodoStatusHandler(todo.id)
    );

    return checkBox;
  }

  getCheckBoxIcon(todo) {
    const checkboxIcon = document.createElement('label');

    checkboxIcon.innerHTML =
      todo.status === TODO_STATUS.COMPLETED
        ? '<i class="far fa-check-circle checked"></i>'
        : '<i class="far fa-circle"></i>';
    checkboxIcon.htmlFor = `todo-checkbox-${todo.id}`;

    return checkboxIcon;
  }

  getText(todo) {
    const text = document.createElement('span');

    text.className = todo.status; // ??
    text.innerText = todo.text;
    text.addEventListener('dblclick', () =>
      this.changeWriteModeHandler(todo.id)
    );

    return text;
  }

  getDeleteButton(todo) {
    const deleteButton = document.createElement('button');

    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete-btns';
    deleteButton.addEventListener('click', () => this.deleteTodoHandler(todo));
    deleteButton.innerHTML = '<i class="fas fa-times"></i>';

    return deleteButton;
  }

  getWriteInput(todo) {
    console.log(todo);
    const writeInput = document.createElement('input');

    writeInput.value = todo.text;
    writeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        todos = todos.map((_todo) =>
          _todo.id === todo.id ? { ..._todo, text: writeInput.value } : _todo
        );
        this.changeReadModeHandler(todo.id);
      }
    });

    return writeInput;
  }

  render(todos) {
    todoList.innerHTML = '';

    todos = this.getTodosByStatusMode(currentStatusMode, todos);

    todos.forEach((todo) => {
      const checkBox = this.getCheckBox(todo);
      const checkboxIcon = this.getCheckBoxIcon(todo);
      const text = this.getText(todo);
      const writeInput = this.getWriteInput(todo);
      const deleteButton = this.getDeleteButton(todo);

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

    activeAccount.innerHTML = `${this.getActiveTodoCount(todos)} items left`;
  }

  // UTIL
  getNewTodoID(todos) {
    return todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
  }

  getActiveTodoCount(todos) {
    return todos.filter((todo) => todo.status === TODO_STATUS.ACTIVE).length;
  }

  getTodosByStatusMode(statusMode, todos) {
    if (statusMode === STATUS_MODE.ALL) {
      return todos;
    }
    return todos.filter((todo) => todo.status === statusMode);
  }

  init() {
    currentStatusMode = localStorage.getItem('statusMode') || STATUS_MODE.ALL;
    todos = JSON.parse(localStorage.getItem('todos')) || [];

    render(todos);

    window.onbeforeunload = () => {
      localStorage.setItem('statusMode', currentStatusMode);
      localStorage.setItem('todos', JSON.stringify(todos));
    };
  }
  // init();
}

const newTodoList = new TodoList();
newTodoList.init();
