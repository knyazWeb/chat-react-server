
import {findMessagesByRoomId} from "./chatService.js";


export const getChatHistory = async (req, res) => {
    const { roomId } = req.query;
    try {
        const messages = await findMessagesByRoomId(roomId);
        res.status(201).json({ messages });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
