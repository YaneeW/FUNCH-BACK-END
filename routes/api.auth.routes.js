import dotenv from "dotenv"
import express from 'express';
const router = express.Router();
dotenv.config();
import UserCtrl from '../controllers/user.ctrl.js';


router.post("/register",UserCtrl.register)
router.post("/login",UserCtrl.login)
router.get("/session",UserCtrl.checkSession)


export default router;