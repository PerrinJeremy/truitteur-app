import express from 'express';
import { json } from 'body-parser';
import {
    connect
} from 'mongoose';
import Router from './routes/api';
import cors from 'cors';
import passport from 'passport';
import './middleware/passport';
import session from 'express-session';
import config from './config';

const app = express()
app.use(json());

app.use(cors({
    origin: ['https://perrinjeremy.github.io'],
    methods: ["GET", "HEAD", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}))

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use([passport.initialize(), passport.session()]);
app.use(Router);

connect(`mongodb+srv://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_DOMAIN}/${config.DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`app is up and listening on port ${process.env.PORT}`)
    });
})