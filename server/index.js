import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
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
import promocodeRouter from './route/promocode.route.js'
import {handleSSEConnection} from './controllers/sseHandler.controller.js'
import notification from './route/notification.route.js'
import weightvariantRouter from './route/weightvariant.route.js'
import session from "express-session";
import passport from "passport";
import homeBannerRouter from './route/homebanner.routes.js'


import "./config/passport.js"; 
import InvoicePDF from './utils/InvoicePDF.js'
import { renderToBuffer } from '@react-pdf/renderer'
const app = express()

app.use(
  session({
    secret: process.env.SESSION_SECRET || "some_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/notification', auth, notification )
app.get('/SSEhandler',auth, handleSSEConnection);
app.use('/api/weight',weightvariantRouter)
app.post('/api/generate-invoice', async (req, res) => {
  try {
    const invoiceData = req.body.order;
    console.log('data:', invoiceData);

    const pdfBuffer = await renderToBuffer(InvoicePDF({ order: invoiceData }));


    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Invoice-${invoiceData.orderId}.pdf"`,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Invoice generation error:', err);
    res.status(500).json({ error: err.message });
  }
});
app.use('/api/homebanner',homeBannerRouter)


app.use('/api/', promocodeRouter);
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})

