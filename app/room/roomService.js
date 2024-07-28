import { prisma } from "../utils/prisma.js";

export const createNewRoom = async (name) => {
  try {
    const room = await prisma.room.create({
      data: {
        name: name,
      },
    });
    return room;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findAllUserRooms = async (userId) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    return rooms;
  } catch (error) {
    throw new Error(error.message);
  }
};
