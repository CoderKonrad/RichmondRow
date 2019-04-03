const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');
const SubmissionSchema = new Schema({

  // Starting to define our schema here.

  name: {

    type: String,
    required: true,
    ref: 'names'

  },

  email: {

    type: String,
    require: true

  },

  slug: {

    type: String

  },

  description: {

    type: String,
    require: true
  },


  file: {

    type: String,
    ref: 'submissionfile'
  },

  date: {

    type: Date,
    default: Date.now()

  },

  status: {
    
    type: Boolean
  }
}, {usePushEach: true});
// This is going to be the name for our model:
SubmissionSchema.plugin(URLSlugs('file', {field: 'slug'}));
module.exports = mongoose.model('submissions', SubmissionSchema);
