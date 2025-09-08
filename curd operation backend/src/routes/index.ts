// const express = require('express');
import express from 'express';
const app = express();

// const usersRouter = require('./routes/users.js');
import usersRouter from './users.js';

app.use('/users', usersRouter);

export default app;
