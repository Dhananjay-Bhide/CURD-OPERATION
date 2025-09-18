// const express = require('express');
import express from 'express';
const app = express();

// const usersRouter = require('./routes/users.js');
import usersRouter from './users.js';
import signUp from './signUp.js';
import login from './login.js';

app.use('/users', usersRouter);
app.use('/signup', signUp);
app.use('/login', login);

export default app;
