import User from "../models/user";

export const getJoin = (req, res) => res.render("Join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  // console.log(req.body);
  const { email, username, password, name, location } = req.body;

  // 중복값이 입력되면 서버 튕김 막기
  const pageTitle = "Join";
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: `This username/email is already taken.`,
    });
  }

  await User.create({
    email,
    username,
    password,
    name,
    location,
  });

  return res.redirect("/login");
};
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove");
