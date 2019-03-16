const admin = require('../../middleware/admin');
const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication');
const auth = require('../../middleware/auth');
// Set Admin Layout

router.all('/*', [auth, admin], (req, res, next)=>{

  req.app.locals.layout = 'admin';
  next();

});


router.get('/', [auth, admin], (req, res)=>{

  Post.count().then(postCount=>
  {
    Comment.count().then(commentCount=>
    {
      Category.count().then(categoryCount=>
      {
        res.render('admin/index', {postCount: postCount, commentCount: commentCount, categoryCount: categoryCount});
      });
    });
  });
});




module.exports = router;
