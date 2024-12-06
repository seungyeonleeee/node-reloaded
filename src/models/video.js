import mongoose from "mongoose";

// 커스텀 함수
// findByIdAndUpdate는 pre를 못써서
// export const formHashtags = (hashtags) => {
//   return hashtags
//     .split(",")
//     .map((word) =>
//       word.startsWith("#") ? `${word} 박필립스` : `#${word} 박필립스`
//     );
// };

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    uppercase: true,
    maxLength: 80,
    required: true,
  },
  description: { type: String, trim: true, minLength: 10, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  fileUrl: {
    type: String,
    required: true,
  },
});

// videoSchema.pre("save", async function () {
//   console.log("We are about to :", this);
//   this.title = "Hahaha! I'm Iron Man";
// });
// pre("save", ): 해당 모델이 실행 되기 전에 무언가를 저장한다
// 업로드 시 콘솔창 나옴

// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });

videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;

// export const formHashtags = (hashtags) => {
//   return hashtags
//     .replace(/\s/g, "")
//     .split(",")
//     .map((tag) =>
//       tag.startsWith("#")
//         ? tag
//         : `
// #${tag}`
//     );
// };
