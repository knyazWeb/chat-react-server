import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import {prisma} from './app/utils/prisma.js';
import "colors";


dotenv.config();


const app = express();

async function startServer() {
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  const PORT = process.env.PORT || 5000;

  app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on
       port ${PORT}`.blue.bold
    )
  );
}

startServer()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
