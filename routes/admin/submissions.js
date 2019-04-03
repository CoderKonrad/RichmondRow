const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
const Submission = require('../../models/Submission');
const Category = require('../../models/Category');
const Post = require('../../models/Post');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
/*
|--------------------------------------------------------------------------
| Set admin layout
|--------------------------------------------------------------------------
*/
router.all('/*', [auth, admin], (req, res, next)=>
{
  req.app.locals.layout = 'admin';
  next();
});

/*
|--------------------------------------------------------------------------
| Render the main admin page
|--------------------------------------------------------------------------
*/
router.get('/', [auth, admin], (req, res)=>
{
  Submission.find({})
  .populate('names')
  .then(submissions=>
  {
    res.render('admin/submissions/submissions', {submissions: submissions});
  })
});

/*
|--------------------------------------------------------------------------
| Deleting submissions functionality
|--------------------------------------------------------------------------
*/
router.delete('/:id', [auth, admin], (req, res)=>
{
  Submission.findOne({_id: req.params.id})
    .populate('names')
    .then(submission=>
    {
      fs.unlink(uploadDir + submission.file, (err)=>
      {
        submission.remove().then(submissionRemoved=>
        {
          req.flash('success_message', 'Submission was successfully deleted');
          res.redirect('/admin/submissions');
        });
      });
    });
});

/*
|--------------------------------------------------------------------------
| Render the create post page
|--------------------------------------------------------------------------
*/
router.get('/feature/:id', [auth, admin], (req, res)=>
{
  Category.find({}).then(categories=>
  {
    Submission.findOne({_id: req.params.id}).then(submissions=>
    {
      res.render('admin/submissions/feature', {categories: categories, submission: submissions});
    });
  });
});

/*
|--------------------------------------------------------------------------
| Submission feature functionality
|--------------------------------------------------------------------------
*/
router.post('/feature/:id', [auth, admin], (req, res)=>
{
  Submission.findOne({_id: req.params.id}).then(submission=>
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
    res.render('admin/submissions',
    {
      errors: errors
    })
  }
  else
  {
    let allowComments = true;

    if(req.body.allowComments)
    {
        allowComments = true;
    }
    else
    {
        allowComments = false;
    }

    console.log(submission.file);
    let file = submission.file;
    filename = file;

    // file.mv('./public/uploads/' + filename, (err)=>
    // {
    //   if (err) throw err;
    // });
    
    const newPost = new Post(
      {
        user: req.session.user,
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
  
});


module.exports = router;