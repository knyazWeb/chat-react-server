import {prisma} from "../utils/prisma.js";

export const findMessagesByRoomId = async (roomId) => {
    try {
        const messages = await prisma.message.findMany({
            where: { roomId: parseInt(roomId) },
            orderBy: { createdAt: 'asc' },
            include: { user: true }
        });
    } catch (error) {
        throw new Error(error.message);
    }
}