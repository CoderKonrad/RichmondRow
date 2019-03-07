const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  // Starting to define our schema here.
  firstName: {

    type: String,
    required: true

  },

  lastName: {

    type: String,
    required: true

  },

  email: {

    type: String,
    required: true,
    unique: true
  },

  password: {

    type: String,
    required: true

  },
});

UserSchema.methods.testMethod = function()
{

};

UserSchema.methods.generateAuthToken = function()
{
  const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
  return token;
}

// This is going too be the name for our model:
module.exports = mongoose.model('users', UserSchema);
