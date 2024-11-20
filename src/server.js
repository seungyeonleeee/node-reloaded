import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const morganMiddleWare = morgan("dev");

// Global Router
const globalRouter = express.Router();

const handleHome = (req, res) => {
  // req, res 순서 주의 -> 요청이 항상 먼저
  return res.send("Home");
};

globalRouter.get("/", handleHome);

const userRouter = express.Router();

const handleEditUser = (req, res) => {
  return res.send("Edit User");
};

userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => {
  return res.send("Watch Video");
};

videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/video", videoRouter);

app.use(morganMiddleWare); // middleware 반드시 get함수 보다 먼저 실행되어야 함, get함수는 종결

const handleListening = () =>
  console.log(`Server Listening on Port http://localhost:${PORT} ✅`);

app.listen(PORT, handleListening);
