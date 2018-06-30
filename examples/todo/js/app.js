// start the app
let todos = new Collection(ToDoModel);
let todoListView = new ToDoListView();
document.body.appendChild(todoListView.el);
