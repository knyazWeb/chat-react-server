import express from "express";
import {createRoom, getAllRooms} from "./roomController.js";



const router = express.Router();

router.post('/create', createRoom);

router.get('/all-rooms', getAllRooms);


export default router;
