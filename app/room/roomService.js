import { prisma } from "../utils/prisma.js";

export const createNewRoom = async (user1, user2) => {
  try {
    const user1Data = await prisma.user.findUnique({
      where: { email: user1.email },
    });
    const user2Data = await prisma.user.findUnique({
      where: { email: user2.email },
    });

    if (!user1Data || !user2Data) {
      throw new Error("One or both users not found");
    }
    // TODO: Нужно обработать когда комната существует
    const room = await prisma.room.create({
      data: {
        name: `${user1Data.username} & ${user2Data.username}`,
      },
    });
    const joinUsersToRoom = await prisma.roomUser.createMany({
      data: [
        {
          userId: user1Data.id,
          roomId: room.id,
        },
        {
          userId: user2Data.id,
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
    const { id: userId } = await prisma.user.findUnique({
      where: {
        authId: authId,
      },
      select: {
        id: true,
      },
    });

    if (!userId) throw new Error("User not found");
    const rooms = await prisma.room.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return rooms;
  } catch (error) {

    throw new Error(error.message);
  }
};
