// this is the model which store one items data and methods
class ToDoModel extends Model {
  constructor(object) {
    let defaults = {
      id: guid(),
      name: "",
      done: false
    };

    super(Object.assign(defaults, object));
  }

  toggle() {
    this.set("done", !this.get("done"));
    sock.send(this.toJSON());
  }
}





class ToDoCollection extends Collection {
  // this overrides the deafult add method
  // if the todo id exsits it updates the model
  // otherwise it adds the model
  add(array) {
    for (let object of array) {

      let found = false;
      let modelFound;

      for (let model of this.array) {
        if (model.get("id") === object.id) {
          found = true;
          modelFound = model;
          break;
        }
      }

      if (found) {
        for (let prop in object) {
          // if the values are different update the model
          if (modelFound.get(prop) !== object[prop]) {
            modelFound.set(prop, object[prop]);
          }
        }
      } else {
        this.addObject(object)
      }
    }
  }
}





// this the main view of the app
// this loads the heading, input and todo views
class ToDoListView extends View {
  constructor(object) {
    super(object);

    // listen for models being added to the todos collection
    // if they are it fires the addTodosItem
    todos.addListener(model => this.addTodoItem(model));
  }

  render() {
    this.el.className = "view";
    this.el.innerHTML = `<div class="heading">Todos:</div>`;

    let toDoInputView = new ToDoInputView();
    this.el.appendChild(toDoInputView.el);

    // adds all the todos in the collection to the screen
    todos.each(model => this.addTodoItem(model));
  }

  addTodoItem(model) {
    let todoItemView = new ToDoItemView(model);
    this.el.appendChild(todoItemView.el);
  }
}





// this is the todo input view
// this is where the todos are created
class ToDoInputView extends View {
  constructor(object) {
    super(object);
  }

  render() {
    this.input = document.createElement("input");
    this.input.onchange = () => this.add();
    this.el.appendChild(this.input);
    return this;
  }

  add() {
    let todoModel = new ToDoModel({name: this.input.value});
    this.input.value = "";
    sock.send(todoModel.toJSON());
  }
}





// this is the todo view which prints the todo name to screen
// plus has a
class ToDoItemView extends View {
  constructor(object) {
    super(object);

    // add listner so when this model updates it renders
    this.model.addListener(() => this.render());
  }

  render() {
    this.el.className = "item " + (this.model.get("done") ? "done" : "");
    this.el.innerHTML = this.model.get("name");
    this.el.onclick = () => this.model.toggle();
    return this;
  }
}
