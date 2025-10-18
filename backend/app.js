import express from 'express';
import errorHandlerMidlleware from './middleware/error.js'
import products from './routes/productsRoutes.js';
import user from "./routes/userRoutes.js"
import order from './routes/orderRoutes.js';
// import payment from './routes/paymentRoutes.js';
import payment from './routes/paymentRoutes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

//

// //


if(process.env.NODE_ENV!=='PRODUCTION'){
dotenv.config({ path: 'backend/config/config.env' })
}
const __filename=fileURLToPath(import.meta.url);
console.log('filename',__filename);
const __dirname=path.dirname(__filename);

const app = express()
app.use(express.json({ limit: '30mb' })) //pase jspn dtata into object
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser());
app.use(fileUpload())
// console.log('routes routes',products, user, order, payment);

//route
app.use('/api/v1', products)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use('/api/v1', payment)
//serve static files
app.use(express.static(path.join(__dirname,'../frontend/dist')));
// app.get('*',(_,res)=>{
//     res.sendFile(path.resolve(__dirname,'../frontend/dist/index.html'))
// })
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandlerMidlleware)
// if(process.env.NODE_ENV!=='PRODUCTION'){
// dotenv.config({ path: 'backend/config/config.env' })
// }

export default app;
