import dotenv from "dotenv"
import express from 'express';
const router = express.Router();
dotenv.config();

import RoomsCtrl from '../controllers/rooms.ctrl.js'

router.get('/room-types',RoomsCtrl.getAllRooms)
router.post('/booking',RoomsCtrl.bookRoom)

export default router;