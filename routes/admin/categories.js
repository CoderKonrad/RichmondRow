const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');
// Set Admin Layout

/*
|--------------------------------------------------------------------------
| Set admin layout
|--------------------------------------------------------------------------
*/
router.all('/*', [auth, admin], userAuthenticated, (req, res, next)=>
{
  req.app.locals.layout = 'admin';
  next();
});

/*
|--------------------------------------------------------------------------
| Render categories page
|--------------------------------------------------------------------------
*/
router.get('/', [auth, admin], (req, res)=>
{
  Category.find({}).then(categories=>
  {
    res.render('admin/categories/index', {categories: categories});
  });
});

/*
|--------------------------------------------------------------------------
| Receive new category form details
|--------------------------------------------------------------------------
*/
router.post('/create', [auth, admin], (req, res)=>
{
    const newCategory = new Category({
        name: req.body.name
      });
      newCategory.save().then(savedCategory=>
      {
        res.redirect('/admin/categories');
      });
});

/*
|--------------------------------------------------------------------------
| Render category edit pages
|--------------------------------------------------------------------------
*/
router.get('/edit/:id', [auth, admin], (req, res)=>
{
    Category.findOne({_id: req.params.id}).then(category=>
      {
        res.render('admin/categories/edit', {category: category});
    });
});

/*
|--------------------------------------------------------------------------
| Edit categories functionality
|--------------------------------------------------------------------------
*/
router.put('/edit/:id', [auth, admin], (req, res)=>
{
    Category.findOne({_id: req.params.id}).then(category=>
      {
        category.name = req.body.name;
        category.save().then(savedCategory=>
        {
          res.redirect('/admin/categories');
        });
    });
});

/*
|--------------------------------------------------------------------------
| Delete categories functionality
|--------------------------------------------------------------------------
*/
router.delete('/:id', [auth, admin], (req, res)=>
{
  Category.remove({_id: req.params.id}).then(result=>
  {
    res.redirect('/admin/categories');
  });
});

module.exports = router;
