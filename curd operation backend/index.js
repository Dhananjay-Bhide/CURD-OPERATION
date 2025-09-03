
// const express = require('express');
import express from 'express';
const app = express();
// const cors = require('cors');
import cors from 'cors';

import index from './src/routes/index.js';
// require('dotenv').config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
// console.log(new Date().toLocaleDateString());

// const usersRouter = require('./routes/users.js');
app.use('/api', index);




