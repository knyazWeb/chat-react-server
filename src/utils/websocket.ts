import { PrismaClient } from "@prisma/client";
import {Server as SocketIOServer} from "socket.io";

interface User {
  authId: string;
  roomId: string;
  username: string;
}

interface Users {
  [key: string]: User;
}

export const webSocket = (io: SocketIOServer, prisma: PrismaClient) => {
  const users: Users  = {};

  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join", async ({ authId, roomId }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { authId: authId },
        });
        if (user) {
          users[socket.id] = { authId, roomId, username: user.username };
          socket.join(roomId);
        }
        console.log("Пользователь присоединился", users);
        console.log("Комнаты:", io.sockets.adapter.rooms);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", "Failed to join room");
      }
    });

    socket.on("leave", async ({ authId, roomId }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { authId: authId },
        });
        if (user) {
          users[socket.id] = { authId, roomId, username: user.username };
          socket.leave(roomId);
        }
        console.log("Пользователь покинул", users);
        console.log("Комнаты:", io.sockets.adapter.rooms);
      } catch (error) {
        console.error("Error leaving room:", error);
        socket.emit("error", "Failed to leave room");
      }
    });

    socket.on("sendMessage", async (message) => {
      try {
        const { authId, roomId, text } = message;
        const user = users[socket.id];
        if (user && authId) {
          const newMessage = await prisma.message.create({
            data: {
              text,
              authId,
              roomId,
            },
            include: { user: true },
          });
          console.log(`${user.username} отправил сообщение:`, newMessage);
          io.to(roomId).emit("message", newMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        delete users[socket.id];
      }
    });
  });
};
