const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = document.querySelector("form");

room.hidden = true;
let roomname;

function addmsg(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = document.querySelector("h3");
  h3.innerText = "Room " + roomname;
  const form = room.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("input");
    const message = input.value;

    socket.emit(
      "message",
      {
        roomname: roomname,
        nickname: "anon",
        msg: message,
      },
      () => {
        addmsg(`You: ${message}`);
      }
    );
    input.value = "";
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("Enter Room", input.value, showRoom);
  roomname = input.value;
  input.value = "";
});

socket.on("welcome", () => {
  addmsg("Someone Joined the room.");
});

socket.on("bye", () => {
  addmsg("Someone left the room.");
});

socket.on("message", (data) => {
  addmsg(`${data.nickname}: ${data.msg}`);
});

socket.on("room changed", (rooms) => {
  console.log(rooms);

  const roomlist = welcome.querySelector("ul");
  roomlist.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomlist.appendChild(li);
  });
});
