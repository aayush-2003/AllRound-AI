// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     firstName: { type: String, required: true, unique: false },
//     lastName: { type: String, required: true, unique: false },
//     email: { type: String, required: true, unique: true },
//     phone_number: { type: String, required: true, unique: true },
//     password: { type: String, required: true, unique: false },
// },
//     { collection: 'users' }
// );

// const model = mongoose.model('UserSchema', userSchema)

// exports.export = model

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, unique: false },
  lastName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: false },
},
{ collection: 'users' }
);

const User = mongoose.model('UserSchema', userSchema);

module.exports = User;
