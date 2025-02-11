import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import { sseHandler,sseHandlerforadmin } from './controllers/order.controller.js'
import { admin } from './middleware/Admin.js'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import adminrouter from './route/admin.route.js'
import auth from './middleware/auth.js'

const app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())

app.use(express.urlencoded({ extended: true }));  // To parse urlencoded data

app.use('/uploads', express.static('uploads'));

app.use(cookieParser())

app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = process.env.PORT 

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/product",productRouter)
app.use("/api/admin",adminrouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)
app.get('/events',auth, sseHandler);
app.get('/eventsadmin',auth,admin, sseHandlerforadmin);
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})

