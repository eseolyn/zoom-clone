const socket = io();

const welcome = document.getElementById("welcome");
const enterForm = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function countUsers(cnt) {
  // count users in room
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${cnt})`;
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = `${message}`;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`Me: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  // save nickname
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  // how can i count users immediately? countUsers(cnt)
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = enterForm.querySelector("#roomName");
  const nicknameInput = enterForm.querySelector("#nickname");
  roomName = roomNameInput.value;
  nickname = nicknameInput.value;
  socket.emit("enter_room", roomName, nickname, showRoom);
  roomNameInput.value = "";
  nicknameInput.value = "";
}

enterForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  addMessage(`${user} Joined!`);
  countUsers(newCount);
});

socket.on("bye", (user, newCount) => {
  addMessage(`${user} left...`);
  countUsers(newCount);
});

// need to make refresh page function...

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  //누군가 socket에 연결하거나, 방을 생성하고, 나갈 때마다 이 이벤트를 받는다.

  //유저에게 오픈채팅방 목록들(+userCount)을 보여주는 역할
  const roomList = welcome.querySelector("ul");
  roomList.innerText = "";
  rooms.forEach(({ roomName, userCount }) => {
    const li = document.createElement("li");
    const room_info = document.createElement("span");
    room_info.innerText = `${roomName} (${userCount})`;
    li.appendChild(room_info);
    li.classList.add("chatRoom");
    roomList.append(li);
  });

  //채팅방 목록을 통한 채팅방 입장
  // const chatRoom = welcome.querySelectorAll('.chatRoom');
  // chatRoom.forEach((room)=>{
  //   room.addEventListener('click',()=>{
  //     socket.emit('enter_room',roomName, nickname, showRoom)
  //   })
  // })
});
