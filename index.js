import express from 'express';
import bodyParser from "body-parser"
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'


import api_auth  from './routes/api.auth.routes.js';
import api_rooms from './routes/api.rooms.routes.js'

async function init(){
    const app = express();

    const port = 3000

    dotenv.config();
    app.use(cookieParser()); 
    app.use(cors({
        origin: "http://localhost:5173",  // ใส่ URL ของ Frontend
        credentials: true  // ต้องเปิด เพื่อให้ Cookie ทำงาน
    }))
    app.use(bodyParser.json())
   

    app.listen(port,()=>{
        console.log(`Server of Feel like heaven hotel is running at ${port}`)
    })

    
    app.use('/auth',api_auth)
    app.use('/rooms',api_rooms)
}

init()