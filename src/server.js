import "./db";
import videoModel from "./models/video";
import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

// middleware 반드시 get함수 보다 먼저 실행되어야 함, get함수는 종결
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // pug 경로를 못찾음 직접 지정해주기
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
