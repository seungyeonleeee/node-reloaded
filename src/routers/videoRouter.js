import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deletevideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

// 동적경로 순서 지켜야됨, 독립적인 경로 반드시 위에
// /:id를 먼저 쓰면 /upload 자체를 id로 인식
// 정규표현식 (\\d+) => 숫자만 허용
videoRouter.route("/upload").get(getUpload).post(postUpload);
// videoRouter.get("/upload", upload);
videoRouter.route("/:id(\\d+)").get(watch); // get과 같은 개념
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// 메서드 체이닝
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/delete", deletevideo);

export default videoRouter;
