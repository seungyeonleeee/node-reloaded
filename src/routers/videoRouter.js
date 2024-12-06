import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

// 동적경로 순서 지켜야됨, 독립적인 경로 반드시 위에
// /:id를 먼저 쓰면 /upload 자체를 id로 인식
// 정규표현식 (\\d+) => 숫자만 허용
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
// videoRouter.get("/upload", upload);
videoRouter.route("/:id([0-9a-f]{24})").get(watch); // get과 같은 개념
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// 메서드 체이닝
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);

export default videoRouter;
