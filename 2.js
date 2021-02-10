checkBox.type = 'checkbox';
    checkBox.id = `todo-checkbox-${todo.id}`;
    checkBox.className = 'check-box';
    checkBox.checked = todo.status === TODO_STATUS.COMPLETED;
    checkBox.addEventListener('change', () =>
      this.changeTodoStatusHandler(todo.id).bind(this)
    );

  

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
