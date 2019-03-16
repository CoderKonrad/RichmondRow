const mongoose = require('mongoose');
const Joi = require('joi');
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

  isAdmin: Boolean 
});

UserSchema.methods.generateAuthToken = function()
{
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin
    },
      config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', UserSchema);

UserSchema.methods.testMethod = function()
{

};


function validateUser(user) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().max(255).email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema);
}
// This is going too be the name for our model:
exports.User = User; 
exports.validate = validateUser;
