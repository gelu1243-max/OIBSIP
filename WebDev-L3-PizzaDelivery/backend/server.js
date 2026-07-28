import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectDB} from './config/db.js';
import router from './route/authRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/users', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});