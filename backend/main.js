import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connect } from './config/db/db.js';
import route from './routes/index.route.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

//middleware xu ly du lieu giup co the truy cap du lieu bang req.body
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//HTTP logger
app.use(morgan('combined'));

app.use(cors());

connect();

route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
