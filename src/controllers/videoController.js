import { response } from "express";
import Video from "../models/video";

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
export const watch = (req, res) => {
  // req => 파라미터 값 가져올 수 있음
  // console.log(req.params.id);

  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("watch", { pageTitle: `Watch ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  // 인코딩이 안되어서 undefined로
  // app.use(express.urlencoded({ extended: true })); server에서 인코딩
  // { title: 'test' } 찾아 옴
  const { title } = req.body;

  videos[id - 1].title = title;

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

  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });

  console.log(video);

  const dbVideo = await video.save();
  console.log(dbVideo);
  return res.redirect("/");
};

export const deletevideo = (req, res) => {
  console.log(req.params);

  return res.send("Delete Videos");
};
