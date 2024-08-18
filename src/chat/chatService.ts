import { prisma } from "../utils/prisma";

export const findMessagesByRoomId = async (roomId: string) => {
  try {
    return await prisma.message.findMany({
      where: { roomId: parseInt(roomId) },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An error occurred");
  }
};
