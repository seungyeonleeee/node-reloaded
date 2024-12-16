import mongoose from "mongoose";

mongoose.connect(`${process.env.DB_URL}/nodejs`);

const db = mongoose.connection;
const handleOpen = () => console.log("Connected to MongoDB ✅");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);
// on 상시
db.once("open", handleOpen);
// once 최초 접속 1회
