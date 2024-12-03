import User from "../models/user";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("Join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  // console.log(req.body);
  const { email, username, password, password1, name, location } = req.body;

  const pageTitle = "Join";

  // 비밀번호 확인
  if (password !== password1) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `Password confirmation does not match`,
    });
  }
  // status(400) : 브라우저 설정에 따라서 UI화면에 에러메세지는 출력이 되지만, 우측 상단에 해당 패스워드를 저장할건지 나오는 경우 있음 => status를 미리 정의

  // 중복값이 입력되면 서버 튕김 막기
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `This username/email is already Taken.`,
    });
  }

  try {
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });

    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";

  const user = await User.findOne({ username });
  // findOne : 찾아오기
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does no",
    });
  }
  console.log(user.password); // 해싱된 비번 찾아옴

  const ok = await bcrypt.compare(password, user.password);
  // compare : 지금 입력한 password와 User안에 password 비교해줌
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  // console.log("USER LOGIN! COMMING SOON!");

  // 정상적으로 로그인이 된 후
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove");
