import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// create Websocket server on top of the http server. both server share same port(3000).

const sockets = [];

wss.on("connection", (socket) => {
  // socket in server.js(backend) mean connected 'browser'.
  console.log("✅ Connected to Browser");
  sockets.push(socket);
  socket["nickname"] = "Anon";
  socket.on("close", () => console.log("❌ Disconnected from the Browser"));
  socket.on("message", (data, isBinary) => {
    const dataStr = isBinary ? data : data.toString();
    const message = JSON.parse(dataStr);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
