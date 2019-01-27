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

  // --- fire custom event
  socket.emit("newEmail", {
    from: "jj@gmail.com",
    subject: "subject 1"
  });

  // --- respond to createEmail event from client
  socket.on("createEmail", data =>
    console.log("server got createEmail event from the client : ", data)
  );

  // --- respond to disconnect after client is closed 
  socket.on("disconnect", () => console.log("client disconnected"));
});

server.listen(port, () => console.log(`app is listening on port : ${port}`));
