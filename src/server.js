import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { Http2ServerRequest } from "http2";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
})

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
  // socket.onAny((event) => {
  //   console.log(`got ${event}`);
  // })

  socket.on("Enter Room", (roomcode, showroom) => {
    socket.join(roomcode);
    showroom();
    socket.to(roomcode).emit("welcome");
  })

  socket.on("message", (data, done) => {
    socket.to(data.roomname).emit("message", {
      nickname: data.nickname,
      msg: data.msg
    });
    done();
  })

  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => {
      socket.to(room).emit("bye");
    });
  })
})

httpServer.listen(3000, () => {
  console.log("Server listening at port 3000");
})