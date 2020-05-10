const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
  name: { type: String },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be greater than 0.');
      }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      validator.con;
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email.');
      }
    },
  },
  password: {
    type: String,
    minlength: 6,
    trim: true,
    required: true,
    validate(value) {
      if (value === 'password') {
        throw new Error('Password cannot be password.');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// generate public user profile
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.password;

  return userObject;
};

//generate token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'secretkey');

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//check user credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isValidCrendentials = await bcrypt.compare(password, user.password);

  if (!isValidCrendentials) {
    throw new Error('Unable to login');
  }

  return user;
};

//hash password
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
