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

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username, location },
    file,
  } = req;

  console.log(file);

  const usernameExists =
    username !== sessionUsername ? await User.exists({ username }) : undefined;

  const emailExists =
    email !== sessionEmail ? await User.exists({ email }) : undefined;

  if (usernameExists || emailExists) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      usernameErrorMessage: usernameExists
        ? "This username is already taken"
        : 0,
      emailErrorMessage: emailExists ? "This email is already taken" : 0,
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path.replace(/\\/g, "/") : avatarUrl,
      // window에서는 "\\"로 나와서 정규표현식으로 "/"로 바꿔주기
      name,
      email,
      username,
      location,
    },
    { new: true }
  );

  req.session.user = updatedUser;
  return res.redirect("/");
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";

  const user = await User.findOne({ username, socialOnly: false });
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

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  // github에서 받은 token이 access 가능한지 다시 github에 알려줘야 함 (핑퐁)
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // console.log(tokenRequest);

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(emailData);
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    // github 이메일과 우리 사이트 이메일이 같으면 같은 사람이라고 판단
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        password: "",
        name: userData.name,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/login");
    }
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    // github로 로그인 한 유저는 password 변경이 안되게
    return res.redirect("/");
  }

  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);

  const ok = await bcrypt.compare(oldPassword, user.password);
  // 기존 비밀번호가 다를 때
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The Current Password is incorrect",
    });
  }

  // 새로운 비밀번호가 동일하지 않을 때
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The Password does not match the confirmation",
    });
  }

  console.log("Old Password", user.password);
  user.password = newPassword;
  console.log("New unhashed Password", user.password);
  await user.save();
  console.log("New Password", user.password);
  req.session.user.password = user.password;

  return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See");
