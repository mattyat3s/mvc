let sock;

function connectToServer() {
  return new Promise((resolve, reject) => {
    sock = new WebSocket("ws://localhost:4000/sock/");
    sock.onmessage = event => {
      var array = JSON.parse(event.data);
      console.log("server message", array);
      todos.add(array);
    }
    sock.onopen = event => resolve();
  });
};
