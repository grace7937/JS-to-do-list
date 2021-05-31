const Task = class {
  constructor(title, isCompleted = false) {
    this.title = title;
    this.isCompleted = false;
  }
  setTitle(title) {
    this.title = title;
    // return new TASK(title, this.isCompleted);
  }

  toggole() {
    this.isCompleted = !this.isCompleted;

    // return new TASK(this.title, !this.isCompleted)
  }
  getInfo() {
    return { title: this.title, isCompleted: this.isCompleted };
  }
};

() => {
  let isOkay = true;

  const task = new Task('test1');

  isOkay =
    task.getInfo().title == 'test1' && task.getInfo().isCompleted == false;
  console.log('test1', isOkay);

  task.toggole();
  isOkay =
    task.getInfo().title == 'test1' && task.getInfo().isCompleted == true;
  console.log('test2', isOkay);
};

const Folder = class {
  constructor(title) {
    this.title = title;
    this.tasks = new Set();
  }
  // addTask(title){
  //     this.tasks.add(new Task(title));
  // }

  addTask(task) {
    if (!task instanceof Task) throw 1;
    this.tasks.add(task);
  }

  removeTask(task) {
    if (!(task instanceof Task)) err('invalid task');
    this.tasks.delete(task);
  }
  getTasks() {
    return [...this.tasks.values()];
  }
  getTile() {
    return this.title;
  }
};

const APP = class {
  constructor() {
    this.folders = new Set();
  }
  addFolder(folder) {
    if (!folder instanceof Folder) err('invalid folder');
    this.folders.add(folder);
  }

  removeFolder(folder) {
    if (!(folder instanceof Folder)) err('invalid folder');
    this.folders.delete(folder);
  }
  getFolders() {
    return [...this.folders.values()];
  }
};

const Renderer = class {
  constructor(app) {
    this.app = app;
  }
  render() {
    this._render();
  }
  _render() {
    err('must be overrided');
  }
};

const el = (tag) => document.createElement(tag);

const DOMRenderer = class extends Renderer {
  constructor(parent, app) {
    super(app);
    this.el = parent.appendChild(el('section'));
    this.el.innerHTMl = `
    <nav>
        <input type='text'>
        <ul></ul>
    </nav>
    <section>
      <header>
        <h2></h2>
        <input type='text'>
      </header>
     <ul></ul>
    </section>
    `;
    const ul = this.el.querySelectorAll('ul');
    this.folder = ul[0];
    this.task = ul[1];
    this.currentFolder = null;

    const input = this.el.querySelectorAll('input');
    input[0].addEventListener('keyup', (e) => {
      if (!e.keyCode != 13) return;
      const v = e.target.value.trim();
      if (!v) return;
      const folder = new Folder(v);
      this.app, addFolder(folder);
      e.target.value = '';
      this.render();
    });

    input[1].addEventListener('keyup', (e) => {
      if (!e.keyCode != 13 || !this.currentFolder) return;
      const v = e.target.value.trim();
      if (!v) return;
      const task = new task(v);
      this.currentFolder.addTask(task);
      e.target.value = '';
      this.render();
    });
  }

  _render() {
    const folders = this.app.getFolders();
    if (!this.currentFolder) this.currentFolder = folders[0];
    this.folder.innerHtml = '';
    folders.forEach((f) => {
      const li = el('li');
      li.innerHTML = f.getTitle();
      li.stytle.cssText =
        'font-weight:' + (this.currentFolder == f ? 'bold' : 'normal');
      li.addEventListener('click', () => {
        this.currendfolder = f;
        this.render();
      });

      this.folder.appendChild(li);
    });
    if (!this.currentFolder) return;
    this.task.innerHTML = '';
    this.currentFolder.getTasks().forEach((t) => {
      const li = el('li');
      const { title, isCompleted } = t.getInfo();
      li.innerHTML = (isCompleted ? ' completed ' : ' process') + title;
      li.addEventListener('click', () => {
        t.toggole();
        this.render();
      });
      this.task.appendChild(li);
    });
  }
};

new DOMRenderer(document.body, new APP());
