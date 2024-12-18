import { response } from "express";
import Video, { formHashtags } from "../models/video";
import User from "../models/user";

// mockup
// const videos = [
//   {
//     id: 1,
//     title: "First Video",
//     createdAt: "2 minutes ago",
//     views: 1,
//     comment: 2,
//     rating: 5,
//   },
//   {
//     id: 2,
//     title: "Second Video",
//     createdAt: "2 minutes ago",
//     views: 59,
//     comment: 2,
//     rating: 5,
//   },
//   {
//     id: 3,
//     title: "Third Video",
//     createdAt: "2 minutes ago",
//     views: 59,
//     comment: 2,
//     rating: 5,
//   },
// ];

export const home = async (req, res) => {
  // then // catch 비동기 함수
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    // Video.find({}) : Video의 내부의 함수를 조건없이 찾아와라
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render("server-error", { error });
  }

  // videoModel
  //   .find()
  //   .then((videos) => {
  //     console.log("videos", videos);
  //     res.render("home", { pageTitle: "Home", videos: [] });
  //   })
  //   .catch((error) => {
  //     console.log("error", error);
  //   });
  // console.log("start");
};

export const search = async (req, res) => {
  // console.log(req.query);
  const { keyword } = req.query;
  // console.log(keyword);

  let videos = [];
  // 쿼리스트링이 있을 때만 videos 주겠다
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        // $regex : mongoose 정규표현식
        // `^${keyword}$`
      },
    }).populate("owner");
    // populate : 참조해온 값까지 가져올 때 사용
  }

  return res.render("Search", {
    pageTitle: "Search",
    videos,
  });
};

export const watch = async (req, res) => {
  // req => 파라미터 값 가져올 수 있음
  // console.log(req.params.id);
  const { id } = req.params;
  // const video = videos[id - 1];
  // console.log(id); // 6743fa54efed3d7ba4d11b45
  // id로 해당 데이터 찾아오기
  const video = await Video.findById(id).populate("owner");
  // console.log(video);
  // const owner = await User.findById(video.owner);
  // user에서 준 값을 다시 user로 가서 찾아야 함 => 비효율적
  // populate : 참조하고 있는 요소의 값도 찾아와줌
  // console.log(video); // owner값도 들어옴

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // status(404) : 요청한 페이지 찾을 수 없음

  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  // console.log(typeof video.owner, typeof _id); // object string
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  return res.render("edit", { pageTitle: `Edit : ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  // 인코딩이 안되어서 undefined로
  // app.use(express.urlencoded({ extended: true })); server에서 인코딩
  // { title: 'test' } 찾아 옴
  // const { title } = req.body;

  const {
    user: { _id },
  } = req.session;

  // 수정된 데이터
  // console.log(req.body);
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  // exists() : id를 찾아오고 현재 URL의 id와 같은지 true,false를 체크

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  // // 수정된 내용으로 바꾸기
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));

  // // 수정된 내용 저장
  // await video.save();

  // 더 간략하게
  // findByIdAndUpdate() : id를 찾아옴과 동시에 업데이트
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  // 수정이 완료된 이후 watch로 가야됨
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { path } = req.file;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;

  // const newVideo = {
  //   id: videos.length + 1,
  //   title,
  //   createdAt: "Just Now",
  //   views: 0,
  //   comment: 0,
  //   rating: 0,
  // };
  // videos.push(newVideo);

  // const video = new Video({
  //   title,
  //   description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags.split(",").map((word) => `#${word}`),
  //   meta: {
  //     views: 0,
  //     rating: 0,
  //   },
  // });
  // console.log(video);
  // const dbVideo = await video.save();
  // console.log(dbVideo);

  try {
    // create : 생성 + save
    const newVideo = await Video.create({
      title,
      description,
      // createdAt: Date.now().toLocaleString(),
      hashtags: Video.formatHashtags(hashtags),
      // meta: {
      //   views: 0,
      //   rating: 0,
      // },
      // video.js에서 default값으로 정의함
      fileUrl: path.replace(/\\/g, "/"),
      owner: _id,
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo);
    user.save();

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  // console.log(id);
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not Found." });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  // findByIdAndDelete() : mongoDB 안에 있는 데이터를 ID값을 기준으로 찾아서 자동으로 삭제해주는 미들웨어 함수

  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views += 1;
  await video.save();

  return res.sendStatus(200);
  // status만 하면 대기중
};
