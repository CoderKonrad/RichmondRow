const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

  // Starting to define our schema here.
  title: {

    type: String,
    required: true

  },

  status: {

    type: String,
    default: 'public'

  },

  allowComments: {

    type: Boolean,
    require: true

  },

  body: {

    type: String,
    require: true

  }
});
// This is going too be the name for our model:
module.exports = mongoose.model('posts', PostSchema);
