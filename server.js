const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const http = require("http");
const server = http.createServer(app);

app.use(express.static(__dirname + "/public"));

const socketIo = require("socket.io");
const io = socketIo(server);

io.on("connect", socket => {
  console.log("server got new connection");

  // --- fire event
  /*socket.emit("newMessage", {
    from: "server",
    text: "from server ",
    createdAt: Date.now()
  });*/

  // --- respond to createMessage event from client
  socket.on("createMessage", ({ from, text }) => {
    console.log(
      `got event from client createMessage. from : ${from} , text : ${text}`
    );

    // --- broadcast : send to all 
    io.emit("newMessage", {
      from,
      text,
      createdAt: Date.now()
    });
  });

  // --- respond to disconnect after client is closed
  socket.on("disconnect", () => console.log("client disconnected"));
});

server.listen(port, () => console.log(`app is listening on port : ${port}`));
