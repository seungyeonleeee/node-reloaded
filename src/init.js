// setting 역할
import "dotenv/config";
import "./db";
import "./models/video";
import "./models/user";
import app from "./server";
// import : 찾아온 이후 실행까지

const PORT = 4000;

const handleListening = () =>
  console.log(`Server Listening on Port http://localhost:${PORT} ✅`);

app.listen(PORT, handleListening);
