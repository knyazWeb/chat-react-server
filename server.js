import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { prisma } from "./app/utils/prisma.js";
import "colors";
import authRoutes from "./app/auth/authRoutes.js";
import chatRoutes from "./app/chat/chatRoutes.js";
import roomRoutes from "./app/room/roomRoutes.js";
import cors from "cors";
import http from "http";
import socketIOMiddleware from "./app/middleware/socketIO.js";
import { Server } from "socket.io";


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

async function startServer() {
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    }),
  );

  app.use(express.json());
  app.use(socketIOMiddleware(io));
  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/room", roomRoutes);

  webSocket(io, prisma);

  const PORT = process.env.PORT || 5000;
  app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
        .bold,
    ),
  );
}

startServer()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
