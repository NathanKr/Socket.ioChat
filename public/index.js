let socket = io();

socket.on("connect", () => {
  console.log("client connected to server");
  // --- fire event
  /*socket.emit(
    "createMessage",
    { from: "client", text: "from client" },
    ackData => console.log("got ack from server : ", ackData)
  );*/
});

socket.on("newMessage", ({ text, from }) => {
  console.log("got newMessage event from server : ", text, from);
  addMessageFromServer(`${from} -> ${text}`);
});

socket.on("disconnect", () => console.log("socket disconnected"));

const addMessageFromServer = msg => {
  const liElem = document.createElement("li");
  liElem.innerText = msg;
  document.getElementById("messages").appendChild(liElem);
};

const handleJoinRoom = event => {
  const selectedRoom = document.getElementById("selectRoom").value;
  event.preventDefault(); // will not cause page refresh
  socket.emit(
    "joinRoom",
    {
      room: selectedRoom
    },
    ackData => {
      console.log("got ack from server : ", ackData);
      document.getElementById("roomName").innerText = selectedRoom;
      document.getElementById("joinRoom").style.display = "none";
    }
  );
};

const submitMessageHandler = event => {
  event.preventDefault(); // will not cause page refresh
  socket.emit(
    "createMessage",
    {
      from: document.getElementById("from").value,
      text: document.getElementById("text").value
    },
    ackData => console.log("got ack from server : ", ackData)
  );
};