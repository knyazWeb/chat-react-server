import { createNewRoom, findAllUserRooms } from "./roomService.js";

export const createRoom = async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    const room = await createNewRoom(user1, user2);
    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  const { authId } = req.query;
  try {
    const rooms = await findAllUserRooms(authId);
    res.status(201).json({ rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
