const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
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
});

module.exports = User;
