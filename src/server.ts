import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "colors";

import cors from "cors";
import http from "http";

import { Server as SocketIOServer } from "socket.io";
import { authRoutes } from "./auth";
import { chatRoutes } from "./chat";
import { socketIOMiddleware } from "./middleware";
import { roomRoutes } from "./room";
import { prisma, webSocket } from "./utils";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

async function main() {
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  app.use(express.json());
  app.use(socketIOMiddleware(io));
  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/room", roomRoutes);

  webSocket(io, prisma);

  const PORT = process.env.PORT || 5000;
  server.listen(
    PORT,
    // @ts-ignore
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
