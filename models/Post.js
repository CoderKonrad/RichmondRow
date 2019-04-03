const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');
const PostSchema = new Schema({

  // Starting to define our schema here.
  potd: {

    type: Boolean,
    ref: 'potd'

  },
  
  user: {

    type: Schema.Types.ObjectId,
    ref: 'users'

  },

  category: {

    type: Schema.Types.ObjectId,
    ref: 'categories'

  },

  title: {

    type: String,
    required: true

  },

  slug: {

    type: String

  },

  status: {

    type: String,
    default: 'public'

  },

  allowComments: {

    type: Boolean,
    require: true

  },

  summary: {

    type: String,
    require: true
  },

  body: {

    type: String,
    require: true

  },

  file: {

    type: String

  },

  date: {

    type: Date,
    default: Date.now()

  },

  comments: [{

    type: Schema.Types.ObjectId,
    ref: 'comments'

  }]
}, {usePushEach: true});
// This is going to be the name for our model:
PostSchema.plugin(URLSlugs('title', {field: 'slug'}));
module.exports = mongoose.model('posts', PostSchema);
