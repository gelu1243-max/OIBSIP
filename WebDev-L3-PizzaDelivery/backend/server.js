import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectDB} from './config/db.js';
import router from './route/authRoutes.js';
import {pizzarouter} from './route/pizzaRoute.js'
import {inventoryrouter}from './route/inventoryRoute.js'
import customPizzaRouter from './route/customPizzaRoutes.js';
import orderRouter from './route/orderRoute.js';
import testrouter from './route/testRouter.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/users', router);
app.use('/api',pizzarouter)
app.use('/api',inventoryrouter);
app.use('/api', customPizzaRouter);
app.use('/api', orderRouter);
app.use('/api', testrouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});