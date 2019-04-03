const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const express = require('express');
const router = express.Router();
const Comment = require('../../models/Comment');
const session = require('express-session');

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
  Comment.find({}).populate('req.session.user')
  .then(comments=>
  {
    res.render('admin/comments', {comments: comments});
  });
});

// /*
// |--------------------------------------------------------------------------
// | Posting comments functionality
// |--------------------------------------------------------------------------
// */
// router.post('/post', [auth], (req, res)=>
// {

//   Post.findOne({_id: req.body.id}).then(post=>
//   {
//     console.log('\n============',req.session.user);
//     const newComment = new Comment(
//     {
//       user: req.session.user,
//       body: req.body.body
//     });
//     post.comments.push(newComment);
//     console.log('works\n');
//     post.save().then(savedPost=>
//     {
//       newComment.save().then(savedComment=>
//       {
//         console.log('works\n');
//         res.redirect(`/post/${post.slug}`);
//       })
//     });
//   });
// });

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
