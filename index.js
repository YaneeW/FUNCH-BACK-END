import express from 'express';
import bodyParser from "body-parser"
import cors from "cors";
import dotenv from "dotenv"


import api_auth  from './routes/api.auth.routes.js';

async function init(){
    const app = express();

    const port = 3000

    dotenv.config();
    app.use(bodyParser.json())

    app.listen(port,()=>{
        console.log(`Server of Feel like heaven hotel is running at ${port}`)
    })

    
    app.use('/auth',api_auth)
}

init()