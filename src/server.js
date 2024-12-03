import "./db";
import videoModel from "./models/video";
import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import { localMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";

const app = express();
const logger = morgan("dev");

// middleware 반드시 get함수 보다 먼저 실행되어야 함, get함수는 종결
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // pug 경로를 못찾음 직접 지정해주기
app.use(logger);
app.use(express.urlencoded({ extended: true }));
// session
app.use(
  session({
    secret: "Hello!",
    // 보통 해싱된 암호를 씀
    resave: true,
    // resave: true => session 안에 있는 데이터가 변경되지 않아도 클라이언트의 매 요청마다 session을 저장하는 옵션
    saveUninitialized: true,
    // saveUninitialized: true => 초기화 되지 않은 session(변경된 데이터가 없는 최초의 session)의 상태에서도 session의 값을 저장하는 옵션 // "일단 session 만든다"
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/nodejs" }),
    // mongoDB > show collections > sessions 생성
    // 로그인하면 sessions에 쿠키, loggedIn, user 저장
  })
);
// app.use((req, res, next) => {
//   // console.log(req.headers); // headers 명세서
//   // 서버가 준 쿠키값이 있음

//   // pug에서는 session 인지 못함
//   // locals : pug가 유일하게 접근 가능
//   // console.log(res);
//   // res.locals.nickname = "you";
//   // res.locals.siteName = "Youtube";

//   // 생성된 session 공간 안에 모든 데이터를 한번에 찾아올 수 있는 함수
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });
app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
