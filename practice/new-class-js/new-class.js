const TODO_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
  },
  STATUS_MODE = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed',
  },
  TEXT_MODE = {
    READ: 'read',
    WRITE: 'write',
  };

let currentStatusMode = STATUS_MODE.ALL;

class Model {
  constructor(text, id) {
    this.todos = [];
  }

  addTodo(text) {
    this.todo = {
      id: this.getNewTodoID(this.todos),
      text: text,
      textMode: TEXT_MODE.READ,
      status: TODO_STATUS.ACTIVE,
    };
    this.todos.push(this.todo);
  }

  deleteTodo(todo) {
    this.todos = this.todos.filter(({ id }) => id !== todo.id);
  }

  getNewTodoID(todos) {
    return todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
  }
}




class View {
  constructor(controller, model) {
   
    this.controller = controller;
    this.model = model;
    this.todoList = document.getElementById('todo-list');
    console.log(this.controller)
  }

  render(todos) {
    this.todoList.innerHTML = '';

    todos = this._getTodosByStatusMode(currentStatusMode, todos);

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

      this.todoList.appendChild(todoWrapper);
    });
  }
  _getTodosByStatusMode(statusMode, todos) {
    if (statusMode === STATUS_MODE.ALL) {
      return todos;
    }
    return todos.filter((todo) => todo.status === statusMode);
  }

  getCheckBox(todo) {
    const checkBox = document.createElement('input');

    checkBox.type = 'checkbox';
    checkBox.id = `todo-checkbox-${todo.id}`;
    checkBox.className = 'check-box';
    checkBox.checked = todo.status === TODO_STATUS.COMPLETED;
    checkBox.addEventListener('change', () =>
      this.changeTodoStatusHandler(todo.id).bind(this)
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
      this.changeWriteModeHandler(todo.id).bind(this)
    );

    return text;
  }
  getWriteInput(todo) {
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

  getDeleteButton(todo) {
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
    deleteButton.className = 'delete-btns';
    deleteButton.addEventListener('click', () => {
      this.controller.deleteTodoHandler(todo).bind(this);
    });

    return deleteButton;
  }
  removeInputTextValue(event) {
    event.target.value = '';
  }
}



class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.additionInput = document.querySelector('#addition-input');
    this.additionInput.addEventListener(
      'keydown',
      this.addTodoHandler.bind(this)
    );
  }

  addTodoHandler(e) {
    const isValidTodoText = e.key === 'Enter' && e.target.value !== '';
    if (isValidTodoText) {
      const text = e.target.value;
      this.model.addTodo(text);
      this.view.render(this.model.todos);
      this.view.removeInputTextValue(e);
    }
  }

  deleteTodoHandler(todo) {
    this.model.deleteTodo(todo);
    this.view.render(this.model);
  }
}

var model = new Model();
var view = new View();
var controller = new Controller(model, view);
