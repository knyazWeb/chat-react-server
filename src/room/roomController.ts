import { createNewRoom, findAllUserRooms } from "./roomService";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  const { user1, user2 } = req.body;
  try {
    const room = await createNewRoom(user1, user2);
    res.status(201).json({ room });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  const { authId } = req.query;
  try {
    const rooms = await findAllUserRooms(authId as string);
    res.status(201).json({ rooms });
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ error: error.message });
    res.status(500).json({ error: "An error occurred" });
  }
};
