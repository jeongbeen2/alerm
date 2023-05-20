const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const HOST = 8080;

app.use(cors());

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

function sendNotification(notification) {
  io.emit("notification", notification);
}

server.listen(HOST, () => {
  console.log(`Server listening on port ${HOST}`);
});

app.get("/test", (req, res) => {
  res.send(`버어튼`);
});

app.post("/time", jsonParser, (req, res) => {
  let { time } = req.body;
  const [hours, minutes] = time.split(":");

  // 예시로 11시에 알림을 보내는 코드
  const notificationTime = new Date();
  notificationTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  const currentTime = new Date();
  const timeUntilNotification = notificationTime - currentTime;

  console.log("timeUntilNotification: ", timeUntilNotification);
  if (timeUntilNotification > 0) {
    setTimeout(() => {
      sendNotification(`Notification for ${hours}:${minutes}`);
    }, timeUntilNotification);
  }
  res.send("ok");
});
