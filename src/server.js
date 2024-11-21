import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

console.log(process.cwd()); // 루트폴더 위치

const app = express();
const logger = morgan("dev");

// middleware 반드시 get함수 보다 먼저 실행되어야 함, get함수는 종결
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // pug 경로를 못찾아서 직접 지정해주기
app.use(logger);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`Server Listening on Port http://localhost:${PORT} ✅`);

app.listen(PORT, handleListening);
