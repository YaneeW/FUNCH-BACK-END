import {supabase} from "../config/db.js"
import bcrypt from "bcrypt"
import "dotenv/config"

const getAllRooms = async (req,res)=>{
    try{
        const result = await supabase
        .from("rooms")
        .select("*")
        if(result.status === 200){
            return res.status(result.status).json({
                message: 'success',
                data: result.data
            })
        }else{
            return res.status(result.status).json({
                data: result.data
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: error,
            data: null
        })
    }
}

const bookRoom = async (req, res) => {
    try {
        const { user_id, room_id, check_in_date, check_out_date } = req.body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
        if (!user_id || !room_id || !check_in_date || !check_out_date) {
            return res.status(400).json({
                message: "User ID, Room ID, Check-in date, and Check-out date are required",
                data: null
            });
        }

        const booking = await supabase
            .from("bookings")
            .insert([
                {
                    user_id,
                    room_id,
                    check_in_date,
                    check_out_date,
                    status: "booked",
                }
            ]);


        return res.status(200).json({
            message: "Room booked successfully",
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: null
        });
    }
};


export default {
    getAllRooms,
    bookRoom
}