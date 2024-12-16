// console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

let volumeValue = 0.5;
video.volume = volumeValue;
// console.log(video.volume);

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};
const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = (event) => {
  // console.log(e.target.value);
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  volumeValue = value;
  video.volume = volumeValue;
};
const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
};
const handleLoadedMetadata = () => {
  const videoDurationTime = Math.floor(video.duration);
  totalTime.innerText = formatTime(videoDurationTime);
  timeline.max = videoDurationTime;
};
const handleTimeUpdate = () => {
  // console.log(video.currentTime);
  const videoCurrentTime = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(videoCurrentTime);
  timeline.value = videoCurrentTime;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
// "input" : "change" 보다 더 실시간으로 반영
video.addEventListener("loadedmetadata", handleLoadedMetadata);
// "loadedmetadata" : 메타데이터가 로드되면 이벤트 시작
video.addEventListener("timeupdate", handleTimeUpdate);
// "timeupdate" : timeupdate속성에 의해 표시된 시간이 currentTime이 업데이트되면 이벤트가 시작
