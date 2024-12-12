import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // unique: true : 중복 X
  },
  avatarUrl: String,
  socialOnly: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  // 예외조항처리
  // 비디오 업로드를 했을때도 save가 돼서 비번이 해싱됨으로 인해서 기존의 비번이 달라지게 되는 경우 마긱 위해서
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
