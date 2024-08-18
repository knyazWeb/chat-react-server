import { findMessagesByRoomId } from "./chatService";
import { Request, Response } from "express";

export const getChatHistory = async (req: Request, res: Response) => {
  const { roomId } = req.query;
  try {
    const messages = await findMessagesByRoomId(roomId as string);
    res.status(201).json({ messages });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
    res.status(500).json({ error: "An error occurred" });
  }
};
