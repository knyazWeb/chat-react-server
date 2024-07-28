import { createNewRoom, findAllUserRooms } from "./roomService.js";

export const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const room = await createNewRoom(name);
    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  const { userId } = req.body;
  try {
    const rooms = await findAllUserRooms(userId);
    res.status(201).json({ rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
