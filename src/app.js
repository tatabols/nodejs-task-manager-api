const express = require('express');
//const morgan = require('morgan');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const { isValidKeys } = require('./utils/validator');

const app = express();
const port = process.env.PORT;
//app.use(morgan('dev'));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
