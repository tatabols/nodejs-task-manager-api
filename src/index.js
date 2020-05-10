const express = require('express');
//const morgan = require('morgan');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const { isValidKeys } = require('./utils/validator');

const app = express();
const port = process.env.PORT || 3000;

//app.use(morgan('dev'));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, (req, res) => {
  console.log('server running in port ' + port);
});
