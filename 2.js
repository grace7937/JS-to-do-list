checkBox.type = 'checkbox';
    checkBox.id = `todo-checkbox-${todo.id}`;
    checkBox.className = 'check-box';
    checkBox.checked = todo.status === TODO_STATUS.COMPLETED;
    checkBox.addEventListener('change', () =>
      this.changeTodoStatusHandler(todo.id).bind(this)
    );