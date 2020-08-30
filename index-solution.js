//Define Object
const Todo = function (description) {
  const randStr = (length) => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const endIdx = length ? length : 10;
    for (let i = 0; i < endIdx; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };
  this.id = randStr(10);
  this.description = description;
};
Todo.prototype.getHtml = function () {
  return `
    <div class='todo' id='todo-${this.id}'>
        <p class='description'>${this.description}</p>
        <div class='options'>
            <div class='delete' onclick='removeTodo("${this.id}")'>DELETE</div>
        </div>
    </div>
  `;
};
//Handlers
let todos = [new Todo("First Todo")];
const addTodo = (todo) => {
  if (!todo instanceof Todo) {
    console.error("argument todo must be instanceof TodoList");
    return;
  }
  todos.push(todo);
  renderTodoList();
  console.log("added new todo!");
};
const removeTodo = (id) => {
  todos = todos.filter((todo) => {
    return todo.id !== id;
  });
  renderTodoList();
  console.log("removed selected todo");
};

const renderTodoList = () => {
  const todoListElement = document.getElementById("todo-wrapper");
  if (!todos.length) {
    todoListElement.innerHTML = `<h3>Your TodoList is Empty!</h3>`;
    return;
  }
  const todoHtmls = todos.map((todo) => {
    return todo.getHtml();
  });
  todoListElement.innerHTML = todoHtmls.join("");
};

const onClickTodoAddButton = () => {
  const description = document.getElementById("todo-input").value;
  if (!description) {
    console.warn("Todo description is empty");
    return;
  }
  document.getElementById("todo-input").value = "";
  addTodo(new Todo(description));
};

document.getElementById("todo-submit").addEventListener("click", (e) => {
  e.preventDefault();
  onClickTodoAddButton();
});
renderTodoList();
