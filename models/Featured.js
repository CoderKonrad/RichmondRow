const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');
const PotdSchema = new Schema({

  // Starting to define our schema here.
  potd: {

    type: Boolean,
    ref: 'potd'

  },
  
  user: {

    type: Schema.Types.ObjectId,
    ref: 'users'

  },

  igAccount: {

    type: String,
    ref: 'igAccount'

  },

  instagram: {

    type: String

  },

  category: {

    type: Schema.Types.ObjectId,
    ref: 'categories'

  },

  title: {

    type: String

  },

  slug: {

    type: String

  },

  file: {

    type: String,
    ref: 'potdfile'

  }
}, {usePushEach: true});
// This is going to be the name for our model:
PotdSchema.plugin(URLSlugs('title', {field: 'slug'}));
module.exports = mongoose.model('potd', PotdSchema);
