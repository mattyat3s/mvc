let todos,
    todoListView;





connectToServer().then(() => {
  // start the app
  todos = new ToDoCollection(ToDoModel);
  todoListView = new ToDoListView();
  document.body.appendChild(todoListView.el);
})
