
import chatModel from "../models/chatModel";
import { Request, Response } from 'express';

export const fetchChat = async (req: Request, res: Response) => {
    try {
        const chats = await chatModel.find({});
    if (chats.length < 1) {
        return res.json({
            message: "No messages found!",
        })
    }
    return res.send(chats);
    }
    catch (e) {
        res.send(404).json({
            message: e
        })
    }
}