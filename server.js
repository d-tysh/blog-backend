import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from 'morgan';
import 'dotenv/config';
import usersRouter from './api/users.js';
import newsRouter from './api/news.js';

const app = express();

const ALLOWED_URLS = process.env.ALLOWED_URLS.split(',');

const corsOptions = {
    origin: (origin, callback) => {
        if (ALLOWED_URLS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}

app.use(logger('tiny'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/users', usersRouter);
app.use('/api/news', newsRouter);

app.use((_, res, __) => {
    return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Use api on routes: /api/news',
        data: 'Not Found'
    })
})

app.use((error, _, res, __) => {
    const { status = 500, message } = error;
    return res.status(status).json({ status, message });
})

const { PORT = 3000, DB_HOST } = process.env;

mongoose
    .connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log('Database connection successful');
        })
    })
    .catch(error => {
        console.log(`Error database connection: ${error.message}`);
        process.exit(1);
    })