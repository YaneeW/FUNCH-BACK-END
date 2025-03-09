import {supabase} from "../config/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import crypto from "crypto";

const register = async (req,res)=>{
    try{

        const emailChecked = await supabase
        .from("users")
        .select("*")
        .eq("email",req.body.email)
        if(emailChecked.data[0]){
            return res.status(400).json({
                message: "Email already registerd!",
                data: null
            })
        }else{
            const userData = {
                username : req.body.username,
                phone_number : req.body.phone_number,
                email: req.body.email,
                password: req.body.password,
            }

            const salt = await bcrypt.genSalt(10)
            userData.password = await bcrypt.hash(userData.password,salt)
            const result = await supabase
            .from("users")
            .insert([userData])
            .select();
            if(result.statusText === "Created"){
                return res.status(200).json({
                    message: "success",
                    data: null
                })
            }else{
                return res.status(result.status).json({
                    message: result.error.message,
                    data: null
                })
            }
        }
    }
    catch(error){
        res.status(500).json({
            message: error,
            data: null
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                data: null
            });
        }
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (fetchError) {
            return res.status(500).json({
                message: "Database error",
                data: null
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                data: null
            });
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                data: null
            });
        }

        const session_token = crypto.randomBytes(32).toString('hex'); // สร้าง token ที่ไม่ซ้ำ
        const expired_at = new Date(Date.now() + 3600000);
        
        const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert([
            {
                user_id: user.user_id,
                session_token: session_token,
                expired_at: expired_at
            }
        ]);

        if (sessionError) {
            return res.status(500).json({
                message: "Session creation failed",
                data: null
            });
        }


        res.cookie("session_token", session_token, {
            httpOnly: true, // ป้องกัน XSS
            secure: process.env.NODE_ENV === "production", // ใช้เฉพาะ HTTPS ใน production
            sameSite: "Strict", // ป้องกัน CSRF
            expires: expired_at
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: null
        });
    }
};

const checkSession = async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token; // ดึง Token จาก Cookie
        if (!sessionToken) {
            return res.status(401).json({ isAuthenticated: false, message: "No session found" });
        }

        const { data: session, error } = await supabase
            .from("sessions")
            .select("*")
            .eq("session_token", sessionToken)
            .gt("expired_at", new Date().toISOString()) // เช็คว่าหมดอายุหรือยัง
            .single();


        if (error || !session) {
            return res.status(401).json({ isAuthenticated: false, message: "Session expired or invalid" });
        }

        const { data: user, error: userError } = await supabase
            .from("users")
            .select("user_id, username, email")
            .eq("user_id", session.user_id)
            .single();

        if (userError || !user) {
            
            return res.status(401).json({ isAuthenticated: false, message: "User not found" });
        }

        return res.status(200).json({
            isAuthenticated: true,
            user,
        });

    } catch (error) {
        return res.status(500).json({ isAuthenticated: false, message: "Internal server error" });
    }
}

export default {
    register,
    login,
    checkSession
}