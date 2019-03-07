const mongoose = require('mongoose');
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
  
}

// This is going too be the name for our model:
module.exports = mongoose.model('users', UserSchema);
