checkBox.type = 'checkbox';
    checkBox.id = `todo-checkbox-${todo.id}`;
    checkBox.className = 'check-box';
    checkBox.checked = todo.status === TODO_STATUS.COMPLETED;
    checkBox.addEventListener('change', () =>
      this.changeTodoStatusHandler(todo.id).bind(this)
    );

    function humanReadable(sec) {
        const h = sec % 3600
        
        // 초가 입력 되면초를 시간으로 나누고 값받고
        // 분을 초로환산한 60을 나누고
        // 그나머지는 그냥 반환
          console.log(h)
       }
      
       humanReadable(3600);