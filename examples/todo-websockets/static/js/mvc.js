class Model {
  constructor(object) {
    this.attributes = object;
    this.listeners = Array();
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  get(prop) {
    return this.attributes[prop];
  }

  set(prop, value) {
    this.attributes[prop] = value;

    for(let listener of this.listeners) {
      listener();
    }
  }

  toJSON() {
    return JSON.stringify(this.attributes);
  }
}





class Collection {
  constructor(model) {
    this.model = model;
    this.array = Array();
    this.listeners = Array();
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  add(data) {
    if (Array.isArray(data)) {
      this.addArray(data);
    } else if (data instanceof Model) {
      this.addModel(data);
    } else {
      this.addObject(data);
    }
  }

  addArray(array) {
    for (let object of array) {
      if (object instanceof Model) {
        this.addModel(object);
      } else {
        this.addObject(object);
      }
    }
  }

  addObject(object) {
    let model = new this.model(object);
    this.addModel(model);
  }

  addModel(model) {
    this.array.push(model);

    for(let listener of this.listeners) {
      listener(model);
    }
  }

  each(callback) {
    for (let object of this.array) {
      callback(object);
    }
  }
}





class View {
  constructor(object) {
    this.el = document.createElement("div");
    this.model = object;
    return this.render();
  }

  render() {
    return this;
  }
}
