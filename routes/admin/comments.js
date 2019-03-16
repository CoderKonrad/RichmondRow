const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');

/*
|--------------------------------------------------------------------------
| Render comment index page
|--------------------------------------------------------------------------
*/
router.all('/*', [auth, admin], (req, res, next)=>
{
  res.app.locals.layout = 'admin';
  next();
});

/*
|--------------------------------------------------------------------------
| Render comment table
|--------------------------------------------------------------------------
*/
router.get('/', [auth, admin], (req, res)=>
{
  Comment.find({}).populate('user')
  .then(comments=>
  {
    res.render('admin/comments', {comments: comments});
  });
});

/*
|--------------------------------------------------------------------------
| Posting comments functionality
|--------------------------------------------------------------------------
*/
router.post('/', [auth, admin], (req, res)=>
{

  Post.findOne({_id: req.body.id}).then(post=>
  {
    const newComment = new Comment(
    {
      user: req.user.id,
      body: req.body.body
    });
    post.comments.push(newComment);
    post.save().then(savedPost=>
    {
      newComment.save().then(savedComment=>
      {
        res.redirect(`/post/${post.id}`);
      })
    });
  });
});

/*
|--------------------------------------------------------------------------
| Deleting comments functionality
|--------------------------------------------------------------------------
*/
router.delete('/:id', [auth, admin], (req, res)=>
{
  Comment.remove({_id: req.params.id}).then(deleteComment=>
  {
    Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>
    {
      if (err) console.log(err);
      res.redirect('/admin/comments');
    });
  });
});

module.exports = router;
