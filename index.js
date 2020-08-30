//Define Object
const Todo = function (description) {
    const randStr = (length) => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const endIdx = length ?
            length :
            10;
        for (let i = 0; i < endIdx; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };
    this.date = new Date();
    this.id = randStr(10);
    this.description = description;
};
Todo.prototype.getHtml = function () {
    return `<div class="todo" id="todo-${this.id}">
    <div class="date">${this.getDateString()}</div>
        <p class="description" id="todo-desc-${this.id}">${this.description}</p>
        <div class="options">
            <div class="edit" onclick="editTodo('${this.id}')">EDIT</div>
            <div class="delete" onclick="removeTodo('${this.id}')">DELETE</div>
        </div>
      </div>`;
};
Todo.prototype.getDateString = function () {
    return `${this.date.getMonth()+1}월 ${this.date.getDate()}일 
    ${this.date.getHours()}:${this.date.getMinutes()}`;
};
//Handlers
let todos = [];
const addTodo = (todo) => {
    //add todo to todos 하나의 투두를 만들어서 배열에서 합침 ...
    todos.push(todo)
    //re-render all todoList
    renderTodoList();
    console.log("added new todo!");
    //console.log(document.getElementById("todo-desc-"+ todo.id).innerText); 
    //value로 뽑는건 input only 텍스트노드는 innerText 태그 안쪽 문자열 =innerText, tag포함 = innerHTML 
};
const removeTodo = (id) => {
    // remove todo from todos using given id(argument) ...
    todos = todos.filter(function (todo) {
        return todo.id !== id;
    });
    //re-render all todoList
    renderTodoList();
    console.log("removed selected todo");
};
const editTodo = (id) => {
    let description = document.getElementById("todo-desc-" + id);
    const descriptionText = description.innerText;
    description.innerHTML =
        `<input type="text" id="edited-description" value="${descriptionText}" placeholder="write new todo description">
         <input type="button" id="edited-desc-submit" value="edit">`;
    const editSubmit = document.getElementById("edited-desc-submit");
    editSubmit.onclick = function (e) {
        let editedDescription = document.getElementById("edited-description").value;
        description.innerText = editedDescription;
        if (!editedDescription.trim()) {
            alert("Empty title is not allowed.");
            description.innerText = descriptionText;
            console.log(descriptionText);
            //description.innerHTML =  //원래 내용으로 복구(이전 내용을 받아놓아야함)
        } else {
            //같은 내용일 때 취소추가
            description.innerText = editedDescription;
            console.log("Edit is success!");
        }
    };
};
const renderTodoList = () => {
    const todoElements = todos
        .map(
            (todo) => { //map의 callback함수의 인수(value,index,array),
                return todo.getHtml(); //todoElements는 모든getHtml의 이어진 형태가 들어감 이걸 html코드에 삽입
            }
        )
        .join(""); //getHtml이 한줄로 합쳐지는 형태 var a =[1,2,3]; a,join("") => 123
    //render todos into 'todo-wrapper' tag ... html에 넣는 코드
    document
        .getElementById("todo-wrapper")
        .innerHTML = todoElements;
    //innerHTML은 getElementById로 가져온 엘리먼트의 태그 사이에 집어넣는 것이므로
    //위의 예제에서는 <div></div>사이에 들어감
};

const onClickTodoAddButton = () => {
    //get input(todo-input) value and call addTodo with Todo instance
    const todo = new Todo(document.getElementById("todo-input").value);
    if (!todo.description.trim()) { //공백은 false
        alert("Empty title is not allowed.");
        return;
    }
    addTodo(todo);
    document
        .getElementById("todo-input")
        .value = "";
};
document
    .getElementById("todo-submit")
    .addEventListener("click", (e) => {
        e.preventDefault(); // 안해주면 버튼 누를 때마다 페이지 새로고침돼서 작동안됨.(form태그 사용 시)
        onClickTodoAddButton();
    });
renderTodoList();

//sort
const stringToUTF = function (t1, t2) { // t1.length==t2.length일 때
    if (t1.description == t2.description) {
        return 0;
    }
    let todoLength = (t1.description.length < t2.description.length) ? t1.description.length : t2.description.length; //글자 수 작은게 삽입됨
    for (i = 0; i < todoLength; i++) {
        if (t1.description.charCodeAt(i) != t2.description.charCodeAt(i)) {
            return t2.description.charCodeAt(i) - t1.description.charCodeAt(i);
        }
    }
    return t2.description.length- t1.description.length;
};

document.getElementById("todo-date-order").addEventListener("click", ((e) => {
    let clickCount = 0;
    return function () {
        let sortter = null;
        if (clickCount % 2 == 0) {
            sortter = (t1, t2) => (t2.date - t1.date);
        } else {
            sortter = (t1, t2) => (t1.date - t2.date);
        }
        todos = todos.sort(sortter);
        clickCount++;

        renderTodoList();
        console.log("changed the order");
    };
})());
document.getElementById("todo-contents-order").addEventListener("click", ((e) => {
    let clickCount = 0;
    return function () {
        let sortter = null;
        if (clickCount % 2 == 0) {
            sortter = (t1, t2) => (stringToUTF(t1,t2));
        } else {
            sortter = (t1, t2) => (stringToUTF(t2,t1));
        }
        todos = todos.sort(sortter);
        clickCount++;

        renderTodoList();
        console.log("changed the order");
    };
})());
