import {supabase} from "../config/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"

const register = async (req,res)=>{
    try{
        // console.log("req",req.body)
        const emailChecked = await supabase
        .from("users")
        .select("*")
        .eq("email",req.body.email)
        // console.log("email",emailChecked)
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
            // console.log("user",userData)
            const result = await supabase
            .from("users")
            .insert([userData])
            .select();
            console.log("result",result)
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

export default {
    register
}