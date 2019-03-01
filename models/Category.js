const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({

  // Starting to define our schema here.
  name: {

    type: String,
    required: true

  },
});
// This is going too be the name for our model:
module.exports = mongoose.model('categories', CategorySchema);
