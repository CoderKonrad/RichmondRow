const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const fs = require('fs');
const path = require('path');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');
/*
|--------------------------------------------------------------------------
| Set admin layout
|--------------------------------------------------------------------------
*/
router.all('/*', userAuthenticated, (req, res, next)=>
{
  req.app.locals.layout = 'admin';
  next();
});

/*
|--------------------------------------------------------------------------
| Render the main admin page
|--------------------------------------------------------------------------
*/
router.get('/', (req, res)=>
{
  Post.find({})
  .populate('category')
  .then(posts=>
  {
    res.render('admin/posts', {posts: posts});
  }).catch(error=>
  {
    console.log('Error fetching posts from database.');
  });
});

/*
|--------------------------------------------------------------------------
| Render the my posts page
|--------------------------------------------------------------------------
*/
router.get('/my-posts', (req, res)=>
{
  try
  {
    Post.find({user: req.user.id})
    .populate('category')
    .then(posts=>
      {
        res.render('admin/posts/my-posts', {posts: posts});
      });
  }
  catch (err)
  {
    console.log(err);
    res.redirect('/admin')
  }
});

/*
|--------------------------------------------------------------------------
| Render the create post page
|--------------------------------------------------------------------------
*/
router.get('/create', (req, res)=>
{
  Category.find({}).then(categories=>
  {
    res.render('admin/posts/create', {categories: categories});
  });
});

/*
|--------------------------------------------------------------------------
| Blog upload functionality
|--------------------------------------------------------------------------
|
| This function deals with posting to our Schema model
| located in models/Post.js
|
*/
router.post('/create', (req, res)=>
{
  let errors = [];
  if (!req.body.title)
  {
    errors.push({message: 'Please add a title.'});
  }

  if (!req.body.body)
  {
    errors.push({message: 'Please add a body.'});
  }

  if (errors.length > 0)
  {
    res.render('admin/posts/create',
    {
      errors: errors
    })
  }
  else
  {

    let filename = '';

     if(!isEmpty(req.files))
     {
       let file = req.files.fileUpload;
       filename = Date.now() + '-' + file.name;
       file.mv('./public/uploads/' + filename, (err)=>
       {
         if(err) throw err;
       });
    }
    let allowComments = true;

    if(req.body.allowComments)
    {
        allowComments = true;
    }
    else
    {
        allowComments = false;
    }

    const newPost = new Post(
      {
        user: req.user.id,
        category: req.body.category,
        title: req.body.title,
        summary: req.body.summary,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename
    });


    newPost.save().then(savedPost =>
    {
      console.log(savedPost);
      req.flash('success_message', `Post ${savedPost.title} was created succesfully`);
      res.redirect('/admin/posts');
    }).catch(error =>
      {
        console.log(error.errors, 'Could not save post!');
      });
    }
  });

/*
|--------------------------------------------------------------------------
| Render edit posts page
|--------------------------------------------------------------------------
*/
router.get('/edit/:id', (req, res)=>
{
  Post.findOne({_id: req.params.id}).then(post=>
  {
    Category.find({}).then(categories=>
    {
      res.render('admin/posts/edit', {post: post, categories: categories});
    });
  });
});


/*
|--------------------------------------------------------------------------
| Edit posts functionality
|--------------------------------------------------------------------------
*/
router.put('/edit/:id', (req, res)=> {

  Post.findOne({_id: req.params.id}).then(post=>
  {
    // Creating new allowComments variable so that
    // it can work with handlebars html.
    if (req.body.allowComments)
    {
      allowComments = true;
    }
    else
    {
      allowComments = false;
    }
    // Updating our original post.
    post.user = req.user.id;
    post.category = req.body.category;
    post.title = req.body.title;
    post.summary = req.body.summary,
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;

    if(!isEmpty(req.files))
    {
        let file = req.files.fileUpload;
        filename = Date.now() + '-' + file.name;
        post.file = filename;

        file.mv('./public/uploads/' + filename, (err)=>
        {
            if(err) throw err;
        });
    }

    // Save post then go to posts page.
    post.save().then(updatedPost=>
    {
      req.flash('success_message', 'Post was successfully updated');
      res.redirect('/admin/posts');
    });
  });
});

/*
|--------------------------------------------------------------------------
| Deleting posts functionality
|--------------------------------------------------------------------------
*/
router.delete('/:id', (req, res)=>
{
  Post.findOne({_id: req.params.id})
    .populate('comments')
    .then(post=>
    {
      fs.unlink(uploadDir + post.file, (err)=>
      {
        if(!post.comments.length < 1)
        {
          post.comments.forEach(comment=>
          {
            comment.remove();
          });
        }
        post.remove().then(postRemoved=>
        {
          req.flash('success_message', 'Post was successfully deleted');
          res.redirect('/admin/posts');
        });
      });
    });
});

module.exports = router;
