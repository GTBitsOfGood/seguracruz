const express = require('express');
const path = require('path');
const morgan = require('morgan');
const winston = require('./res/winston');
const session = require('express-session');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Routes
const smsRouter = require('./routes/sms');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.static(path.resolve("./") + "/build"));
app.use(express.json());
app.use(express.urlencoded({"extended": false}))
app.use(session(
  { secret: process.env.SECRET, expires: new Date(Date.now() + (1000 * 60 * 5)), saveUninitialized: false, resave: false}
));
app.use(morgan('combined', {stream: winston.stream}));
app.use(smsRouter);
app.use('/api', apiRouter);
app.use('/api', authRouter);

module.exports = app;
