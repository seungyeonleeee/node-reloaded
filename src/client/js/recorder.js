const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

// 녹화중지지
const handleStop = () => {
  startBtn.innerText = "Start Recoding";

  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
};
// 녹화시작
const handleStart = () => {
  startBtn.innerText = "Stop Recoding";

  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  const recorder = new MediaRecorder();
};
const init = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  // console.log(stream);
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
