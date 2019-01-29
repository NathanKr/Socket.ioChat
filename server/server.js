const constants = require("./constans");
const utils = require("./utils");
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
let selectedRoom ;

app.use(express.static(path.join(__dirname, "../") + "/public"));

const socketIo = require("socket.io");
const io = socketIo(server);
const { newMessage, admin } = constants;

// --- client was connected
io.on("connect", socket => {
  console.log("server got new connection");
  // --- send on connect to this client
  socket.emit(
    newMessage,
    utils.createMessage(admin, "Welcome to the chat room")
  );

  // --- send on connect to all beside this client
  socket.broadcast.to(selectedRoom).emit(
    newMessage,
    utils.createMessage(admin, "New user entered the chat room")
  );

  // --- espond to joinRoom event from client
  socket.on("joinRoom", ({ room }, ackCallback) => {
    console.log(`got event from client joinRoom. room : ${room}`);
    selectedRoom = room;
    socket.join(room); // --- this socket is attached to room

    ackCallback("this is server ack");
  });

  // --- respond to createMessage event from client
  socket.on("createMessage", ({ from, text }, ackCallback) => {
    console.log(
      `got event from client createMessage. from : ${from} , text : ${text}`
    );

    // --- send to all client beside the one that send it
    socket.broadcast.to(selectedRoom).emit(newMessage, { from, text });
    ackCallback("this is server ack");

    // --- send to all clients including your self
    /*io.emit(newMessage, {
      from,
      text,
      createdAt: Date.now()
    });*/
  });

  /* --- broadcast : send to all clients beside your self - 
    socket.broadcast.emit("newMessage", {
      from,
      text,
      createdAt: Date.now()
    });
  });*/

  // --- respond to disconnect after client is closed
  socket.on("disconnect", () => {
    // --- send on connect to all beside this client
    socket.broadcast.to(selectedRoom).emit(
      newMessage,
      utils.createMessage(admin, "User has exit the chat room")
    );
  });
});

server.listen(port, () => console.log(`app is listening on port : ${port}`));
