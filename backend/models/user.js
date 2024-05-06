const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    storySegId: {
      type: Number,
      default: 0
    },
    penguinColor: String,
    // references Inventory schema 
    inventory: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }], default: [] }
  }
);

const User = mongoose.model('User', userSchema);


module.exports = User;