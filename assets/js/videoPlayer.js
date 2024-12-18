/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/videoPlayer.js":
/*!**************************************!*\
  !*** ./src/client/js/videoPlayer.js ***!
  \**************************************/
/***/ (() => {

eval("// console.log(\"video player\");\n\nconst video = document.querySelector(\"video\");\nconst playBtn = document.getElementById(\"play\");\nconst playBtnIcon = playBtn.querySelector(\"i\");\nconst muteBtn = document.getElementById(\"mute\");\nconst muteBtnIcon = muteBtn.querySelector(\"i\");\nconst volumeRange = document.getElementById(\"volume\");\nconst currentTime = document.getElementById(\"currentTime\");\nconst totalTime = document.getElementById(\"totalTime\");\nconst timeline = document.getElementById(\"timeline\");\nconst fullScreenBtn = document.getElementById(\"fullScreen\");\nconst fullScreenBtnIcon = fullScreenBtn.querySelector(\"i\");\nconst videoContainer = document.getElementById(\"videoContainer\");\nconst videoControls = document.getElementById(\"videoControls\");\nlet controlsTimeout = null;\nlet controlsMovementTimeout = null;\nlet volumeValue = 0.5;\nvideo.volume = volumeValue;\n// console.log(video.volume);\n\nconst handlePlayClick = () => {\n  if (video.paused) {\n    video.play();\n  } else {\n    video.pause();\n  }\n  playBtnIcon.classList = video.paused ? \"fa-solid fa-play\" : \"fa-solid fa-pause\";\n};\nconst handleMute = () => {\n  if (video.muted) {\n    video.muted = false;\n  } else {\n    video.muted = true;\n  }\n  // muteBtn.innerText = video.muted ? \"Unmute\" : \"Mute\";\n  muteBtnIcon.classList = video.muted ? \"fa-solid fa-volume-xmark\" : \"fa-solid fa-volume-high\";\n  volumeRange.value = video.muted ? 0 : volumeValue;\n};\nconst handleVolumeChange = event => {\n  // console.log(e.target.value);\n  const {\n    target: {\n      value\n    }\n  } = event;\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.innerText = \"Mute\";\n  }\n  volumeValue = value;\n  video.volume = volumeValue;\n};\nconst formatTime = seconds => {\n  return new Date(seconds * 1000).toISOString().substring(14, 19);\n};\nconst handleLoadedMetadata = () => {\n  const videoDurationTime = Math.floor(video.duration);\n  totalTime.innerText = formatTime(videoDurationTime);\n  timeline.max = videoDurationTime;\n};\nconst handleTimeUpdate = () => {\n  // console.log(video.currentTime);\n  const videoCurrentTime = Math.floor(video.currentTime);\n  currentTime.innerText = formatTime(videoCurrentTime);\n  timeline.value = videoCurrentTime;\n};\nconst handleTimelineChange = event => {\n  // console.log(event.target.value);\n  const {\n    target: {\n      value\n    }\n  } = event;\n  video.currentTime = value;\n};\nconst handleFullScreen = () => {\n  const fullScreen = document.fullscreenElement;\n  // document.fullscreenElement : 브라우저가 fullscreen인지 아닌지 확인\n  if (fullScreen) {\n    document.exitFullscreen();\n    // fullScreenBtn.innerText = \"Enter Full Screen\";\n    fullScreenBtnIcon.classList = \"fa-solid fa-expand\";\n  } else {\n    videoContainer.requestFullscreen();\n    // fullScreenBtn.innerText = \"Exit Full Screen\";\n    fullScreenBtnIcon.classList = \"fa-solid fa-compress\";\n  }\n};\nconst hideControls = () => videoControls.classList.remove(\"showing\");\nconst handleMouseMove = () => {\n  if (controlsTimeout) {\n    clearTimeout(controlsTimeout);\n    controlsTimeout = null;\n  }\n  if (controlsMovementTimeout) {\n    clearTimeout(controlsMovementTimeout);\n    controlsMovementTimeout = null;\n  }\n  videoControls.classList.add(\"showing\");\n  controlsMovementTimeout = setTimeout(hideControls, 3000);\n};\nconst handleMouseLeave = () => {\n  controlsTimeout = setTimeout(hideControls, 1500);\n  // setTimeout이 작동되면 얘만의 고유한 id가 생성됨\n  // console.log(controlsTimeout);\n};\nconst changeVideoTime = seconds => {\n  video.currentTime += seconds;\n};\ndocument.addEventListener(\"keyup\", event => {\n  if (event.code === \"Space\") {\n    handlePlayClick();\n  }\n  if (event.code === \"ArrowRight\") {\n    changeVideoTime(5);\n  }\n  if (event.code === \"ArrowLeft\") {\n    changeVideoTime(-5);\n  }\n});\n// console.log(videoContainer.dataset); // id: \"675f9594a5e485551afe23c5\"\nconst handleEnded = () => {\n  // console.log(\"Video Finished\");\n  // registerView가 이때 작동\n  // 먼저 url값 찾아오기\n  // watch.pug에 id를 심어놓고 찾아오기 data-id=video._id\n  const {\n    dataset: {\n      id\n    }\n  } = videoContainer;\n  fetch(`/api/videos/${id}/view`, {\n    method: \"POST\"\n  });\n};\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolumeChange);\n// \"input\" : \"change\" 보다 더 실시간으로 반영\nvideo.addEventListener(\"loadeddata\", handleLoadedMetadata);\n// \"loadedmetadata\" : 메타데이터가 로드되면 이벤트 시작\n// loadeddata가 loadedmetadata보다 폭이 넓음\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate);\n// \"timeupdate\" : timeupdate속성에 의해 표시된 시간이 currentTime이 업데이트되면 이벤트가 시작\ntimeline.addEventListener(\"input\", handleTimelineChange);\nfullScreenBtn.addEventListener(\"click\", handleFullScreen);\nvideo.addEventListener(\"mousemove\", handleMouseMove);\nvideo.addEventListener(\"mouseleave\", handleMouseLeave);\nvideo.addEventListener(\"click\", handlePlayClick);\nvideo.addEventListener(\"ended\", handleEnded);\n\n//# sourceURL=webpack://nodeproject/./src/client/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;