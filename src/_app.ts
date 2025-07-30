import express from 'express';
import passport from 'passport';
import { globalErrorHandler, notFound } from '@/app/errors';
import { rootResponse } from '@/shared';
import { router } from '@/app/routes';
import { ENV } from './config';
import './config/_passport';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  expressSession({
    secret: ENV.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.set('json spaces', 2);
app.all('/', rootResponse);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
