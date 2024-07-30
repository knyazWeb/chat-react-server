import { prisma } from "../utils/prisma.js";

export const createNewRoom = async (user1, user2) => {
  try {

    // fiond user1 and user2
    const user1Data = await prisma.user.findUnique({
      where: { email: user1.email },
    });
    const user2Data = await prisma.user.findUnique({
      where: { email: user2.email },
    });

    if (!user1Data || !user2Data) {
      throw new Error("One or both users not found");
    }
    // Check existing room
    let existingRoom = await prisma.room.findUnique({
      where: { name: `${user1Data.username} & ${user2Data.username}` },
    });
    if (existingRoom) {
      throw new Error("Room already exists");
    }

    // Create new room
    const room = await prisma.room.create({
      data: {
        name: `${user1Data.username} & ${user2Data.username}`,
      },
    });

    // Join users to room when room created
    const joinUsersToRoom = await prisma.roomUser.createMany({
      data: [
        {
          authId: user1.authId,
          roomId: room.id,
        },
        {
          authId: user2.authId,
          roomId: room.id,
        },
      ],
    });
    return room;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const findAllUserRooms = async (authId) => {
  try {
    if (!authId) throw new Error("User not found");
    const rooms = await prisma.room.findMany({
      where: {
        users: {
          some: {
            authId: authId,
          },
        },
      },
    });

    return rooms;
  } catch (error) {
    throw new Error(error.message);
  }
};
