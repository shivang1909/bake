// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// dotenv.config()
// import cookieParser from 'cookie-parser'
// import morgan from 'morgan'
// import helmet from 'helmet'
// import connectDB from './config/connectDB.js'
// import userRouter from './route/user.route.js'
// import categoryRouter from './route/category.route.js'
// import productRouter from './route/product.route.js'
// import cartRouter from './route/cart.route.js'
// import addressRouter from './route/address.route.js'
// import orderRouter from './route/order.route.js'
// import adminrouter from './route/admin.route.js'

// const app = express()
// app.use(cors({
//     credentials : true,
//     origin : process.env.FRONTEND_URL
// }))
// app.use(express.json())

// app.use(express.urlencoded({ extended: true }));  // To parse urlencoded data

// app.use('/uploads', express.static('uploads'));

// app.use(cookieParser())

// app.use(helmet({
//     crossOriginResourcePolicy : false
// }))

// const PORT = process.env.PORT 

// app.get("/",(request,response)=>{
//     ///server to client
//     response.json({
//         message : "Server is running " + PORT
//     })
// })

// app.use('/api/user',userRouter)
// app.use("/api/category",categoryRouter)
// app.use("/api/product",productRouter)
// app.use("/api/admin",adminrouter)
// app.use("/api/cart",cartRouter)
// app.use("/api/address",addressRouter)
// app.use('/api/order',orderRouter)

// connectDB().then(()=>{
//     app.listen(PORT,()=>{
//         console.log("Server is running",PORT)
//     })
// })

// // testing sse 



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import adminrouter from './route/admin.route.js';
import { MongoClient } from 'mongodb';

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse urlencoded data
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan('dev')); // Logging HTTP requests

const PORT = process.env.PORT;

// Store connected SSE clients
let clients = [];

// SSE endpoint
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = Date.now(); // Unique ID for the client
  const newClient = { id: clientId, res }; // Store the client's response object
  clients.push(newClient); // Add the client to the list

  // Send a heartbeat to keep the connection alive
  const heartbeatInterval = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // Remove client when they disconnect
  req.on('close', () => {
    clearInterval(heartbeatInterval);
    clients = clients.filter((client) => client.id !== clientId);
  });
});

// Notify all connected clients
function notifyClients(data) {
  clients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// MongoDB Change Stream for orders collection
async function setupChangeStream() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();
  const ordersCollection = db.collection('orders');

  // Watch for changes in the orders collection
  const changeStream = ordersCollection.watch();

  changeStream.on('change', (change) => {
    // Check if the change includes the `orderStatus` field
    if (
      change.operationType === 'insert' ||
      (change.operationType === 'update' &&
        change.updateDescription.updatedFields.orderStatus)
    ) {
      const orderId = change.documentKey._id;
      const orderStatus =
        change.fullDocument?.orderStatus ||
        change.updateDescription.updatedFields.orderStatus;

      // Notify all connected clients
      notifyClients({ orderId, orderStatus });
    }
  });
}

// Routes
app.get('/', (request, response) => {
  response.json({
    message: 'Server is running ' + PORT,
  });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/admin', adminrouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Connect to DB and start server
connectDB().then(() => {
  setupChangeStream(); // Set up MongoDB Change Stream
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
});