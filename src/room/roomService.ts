import { prisma } from "../utils/prisma";

interface User {
  email: string;
}

export const createNewRoom = async (user1: User, user2: User) => {
  try {
    // find user1 and user2
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
    await prisma.roomUser.createMany({
      data: [
        {
          authId: user1Data.authId,
          roomId: room.id,
        },
        {
          authId: user2Data.authId,
          roomId: room.id,
        },
      ],
    });

    return room;
  } catch (error) {
    if (error instanceof Error) new Error(error.message)
    new Error("An error occurred");
  }
};

export const findAllUserRooms = async (authId: string) => {
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
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const transformedRooms = rooms.map(({ messages, ...room }) => {
      const lastMessage = messages.length ? messages[0].text : "";
      const partner = room.users.find((user) => user.authId !== authId);
      return {
        ...room,
        lastMessage,
        partnerID: partner?.authId as string,
      };
    });

    return transformedRooms;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An error occurred");
  }
};
