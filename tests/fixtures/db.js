const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'test user 1',
  email: 'test1@test.com',
  password: 'password1',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwo = {
  name: 'test user 2',
  email: 'test2@test.com',
  password: 'password1',
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'This is a task 1',
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'This is a task 2',
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'This is a task 3',
  completed: true,
  owner: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new Task(taskOne).save();

  await new Task(taskTwo).save();
};

module.exports = {
  setupDatabase,
  userOneId,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
};
