const auth = require('../../middleware/auth');
const express = require('express');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const router = express.Router();
/*
|--------------------------------------------------------------------------
| Posting comments functionality
|--------------------------------------------------------------------------
*/
router.post('/post', [auth], (req, res)=>
{

  Post.findOne({_id: req.body.id}).then(post=>
  {
    console.log('\n============',req.session.user);
    const newComment = new Comment(
    {
      user: req.session.user,
      body: req.body.body
    });
    post.comments.push(newComment);
    console.log('works\n');
    post.save().then(savedPost=>
    {
      newComment.save().then(savedComment=>
      {
        console.log('works\n');
        res.redirect(`/post/${post.slug}`);
      })
    });
  });
});

module.exports = router;