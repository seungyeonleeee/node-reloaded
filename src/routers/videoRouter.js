import express from "express";
import { upload, see, edit, deletevideo } from "../controllers/videoController";

const videoRouter = express.Router();

// 동적경로 순서 지켜야됨, 독립적인 경로 반드시 위에
// /:id를 먼저 쓰면 /upload 자체를 id로 인식
// 정규표현식 (\\d+) => 숫자만 허용
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deletevideo);

export default videoRouter;
