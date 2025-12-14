import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import fs from 'fs';


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// Create uploads folder if missing
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');


app.use('/api', analyzeRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));