const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

// Set Admin Layout
router.all('/*', (req, res, next)=>
{
  req.app.locals.layout = 'admin';
  next();
});

// Render main admin page
router.get('/', (req, res)=>
{
  Post.find({}).then(posts=>
  {
    res.render('admin/posts', {posts: posts});
  }).catch(error=>
  {
    console.log('Error fetching posts from database.');
  });
});
// Render admin create post page
router.get('/create', (req, res)=>
{
  res.render('admin/posts/create');
});
// Route to post blogs to database
router.post('/create', (req, res)=>
{
  let file = req.files.fileupload;
  let filename = file.name;

  file.mv('./public/uploads/' + filename, (err)=>
  {
    if (err) throw err;
  });

  let allowComments = true;
  if (req.body.allowComments)
  {
    allowComments = true;
  }
  else
  {
    allowComments = false;
  }
  // Integrating Post Constructor
  const newPost = new Post(
  {
    title: req.body.title,
    status: req.body.status,
    allowComments: allowComments,
    body: req.body.body
  });

  newPost.save().then(savedPost =>
  {
    console.log(savedPost);
    res.redirect('/admin/posts');
  }).catch(error =>
    {
    console.log('Could not save post!');
  });
});
// Render edit post page
router.get('/edit/:id', (req, res)=>
{
  Post.findOne({_id: req.params.id}).then(post=>
  {
    res.render('admin/posts/edit', {post: post});

  });
});

// Route for editing posts, updates current post with
// new form data...
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
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    // Save post then go to posts page.
    post.save().then(updatedPost=>
    {
      res.redirect('/admin/posts');
    });
  });
});

// Deleting posts
router.delete('/:id', (req, res)=>
{
  Post.deleteOne({_id: req.params.id})
    .then(result=>
    {
      res.redirect('/admin/posts');
    });
});

module.exports = router;
