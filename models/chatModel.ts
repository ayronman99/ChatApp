import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChatModel = new Schema({
    id: String,
    user: String,
    message: String
})

export default mongoose.model("ChatModel", ChatModel);