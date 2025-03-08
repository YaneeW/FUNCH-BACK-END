import dotenv from "dotenv"
import express from 'express';
const router = express.Router();
dotenv.config();
import UserCtrl from '../controllers/user.ctrl.js';


router.post("/register",UserCtrl.register)


export default router;