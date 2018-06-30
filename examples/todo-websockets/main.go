package main

import (
  "net/http"
  "golang.org/x/net/websocket"
  "log"
)

/* variables */
const Url   = "localhost:4000"
var Clients = make(map[Client]int)
var Todos   = []Todo{}

/* router */
func init() {
  http.Handle("/sock/", websocket.Handler(SockServer))
  http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("static"))))
}

/* start server */
func main() {
  err := http.ListenAndServe(Url, nil)
  if err != nil {
    panic("ListenAndServe: " + err.Error())
  }
}

/* models */
type Client struct {
  WebSocket *websocket.Conn
  ClientIP  string
}

type Todo struct {
  Id      string  `json:"id"`
  Name    string  `json:"name"'`
  Done    bool    `json:"done"`
}

/* handlers */
func SockServer(ws *websocket.Conn) {
  // add the current client to the clients list
  var currentClient = Client{ws, ws.Request().RemoteAddr}
  Clients[currentClient] = 0

  // send the initial state to this client
  websocket.JSON.Send(ws, Todos)

  // create an inifinate for loop that is waiting for messages
  for {
    var err error
    var todo Todo
    var found bool

    if err = websocket.JSON.Receive(ws, &todo); err != nil {
      log.Println("cant read message so player has left", err.Error())
      delete(Clients, currentClient)
      return
    }

    for i, _ := range Todos {
      if Todos[i].Id == todo.Id {
        found = true;
        Todos[i].Name = todo.Name
        Todos[i].Done = todo.Done
        break
      }
    }

    if (found == false) {
      Todos = append(Todos, todo)
    }

    for client, _ := range Clients {
      websocket.JSON.Send(client.WebSocket, Todos)
    }
  }
}
