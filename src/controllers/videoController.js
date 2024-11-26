import { response } from "express";
import Video, { formHashtags } from "../models/video";

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
    const videos = await Video.find({});
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

export const search = (req, res) => res.send("Search Videos");

export const watch = async (req, res) => {
  // req => 파라미터 값 가져올 수 있음
  // console.log(req.params.id);

  const { id } = req.params;
  // const video = videos[id - 1];
  // console.log(id); // 6743fa54efed3d7ba4d11b45

  // id로 해당 데이터 찾아오기
  const video = await Video.findById(id);
  // console.log(video);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }

  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
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
    hashtags: formHashtags(hashtags),
  });

  // 수정이 완료된 이후 watch로 가야됨
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;

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
    await Video.create({
      title,
      description,
      // createdAt: Date.now().toLocaleString(),
      hashtags: formHashtags(hashtags),
      // meta: {
      //   views: 0,
      //   rating: 0,
      // },
      // video.js에서 default값으로 정의함
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deletevideo = (req, res) => {
  console.log(req.params);

  return res.send("Delete Videos");
};
