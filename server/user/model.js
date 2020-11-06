const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
