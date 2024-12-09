import multer from "multer";

export const localMiddleware = (req, res, next) => {
  // console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn); // req.session.loggedIn => 문자열이라
  res.locals.siteName = "Youtube";
  // res.locals.loggedInUser = req.session.user;
  // console.log(res.locals);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// 로그인이 되지 않았는데 로그인을 했을때만 사용할 수 있는 기능들을 막자.
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: { fileSize: 3000000 },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: { fileSize: 10000000 },
});
