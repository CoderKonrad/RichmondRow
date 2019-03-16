const _ = require('lodash');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Category = require('../../models/Category');
const config = require('config');
const express = require('express');
const Post = require('../../models/Post');
const router = express.Router();
const User = require('../../models/User');



/*
|--------------------------------------------------------------------------
| Home routes collection
|--------------------------------------------------------------------------
|
| This function deals with the main home route.
|
*/
router.all('/*', (req, res, next)=>{

  req.app.locals.layout = 'home';
  next();

});

/*
|--------------------------------------------------------------------------
| Render index.handlebars
|--------------------------------------------------------------------------
*/
router.get('/', (req, res)=>{
  try
  {
    console.log('isadmin? '+ req.user.isAdmin);
  }
  catch{

  }
  const 
  perPage = 5;
  const page = req.query.page || 1;

  Post.find({})
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .then(posts =>
  {
    Post.count().then(postCount=>
    {
      Category.find({}).then(categories=>
      {
        res.render('home/index',
        {
          posts: posts,
          categories: categories,
          current: parseInt(page),
          pages: Math.ceil(postCount / perPage),
          user: req.session.user,
          
        });
      });
    });
  });
});

/*
|--------------------------------------------------------------------------
| Render about page
|--------------------------------------------------------------------------
*/
router.get('/about', (req, res)=>{

  res.render('home/about');

});

/*
|--------------------------------------------------------------------------
| Render login page
|--------------------------------------------------------------------------
*/
router.get('/login', (req, res)=>{

  res.render('home/login');

});

// /*
// |--------------------------------------------------------------------------
// | App login
// |--------------------------------------------------------------------------
// |
// | Login middleware.
// |
// */
// passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>
// {
//   User.findOne({email: email}).then(user=>
//   {
//     if (!user) return done(null, false, {message: 'Account not found.'});
//     bcrypt.compare(password, user.password, (err, matched)=>
//     {
//       if (err) return err;
//       if (matched)
//       {
//         return done(null, user);
//       }
//       else
//       {
//         return done(null, false, {message: 'Incorrect password.'});
//       }
//     });
//   });
// }));

// /*
// |--------------------------------------------------------------------------
// | Serialize/Deserialize
// |--------------------------------------------------------------------------
// */
// passport.serializeUser(function(user, done)
// {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done)
// {
//   User.findById(id, function(err, user)
//   {
//     done(err, user);
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | Get user details
// |--------------------------------------------------------------------------
// |
// | This function verifies user tokens.
// |
// */
// router.get('/me', auth, async (req, res)=>
// {
//   const user = await User.findById(req.user._id).select('-password');
//   res.send(user);
// });

// /*
// |--------------------------------------------------------------------------
// | Login form route
// |--------------------------------------------------------------------------
// |
// | This function gets login details and handles login.
// |
// */
// router.post('/login',  (req, res, next)=>{
//   passport.authenticate('local',
//   {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   }), function(req, res, next)
//   {
//     // const token = jwt.sign({_id: req.user._id}, config.get('jwtPrivateKey'));
//     // res.send(token);
//     console.log('test');
//   }
// });



// /*
// |--------------------------------------------------------------------------
// | Logout form route
// |--------------------------------------------------------------------------
// |
// | This function logs our user out.
// |
// */
// router.get('/logout', (req, res)=>
// {
//   req.logOut();
//   res.redirect('/');
// });

/*
|--------------------------------------------------------------------------
| Render register page
|--------------------------------------------------------------------------
*/
router.get('/register', (req, res)=>{

  res.render('home/register');

});

// /*
// |--------------------------------------------------------------------------
// | Register form route
// |--------------------------------------------------------------------------
// |
// | This function receives registration details from
// | new users and adds their details to the db.
// |
// */
// router.post('/register', (req, res)=>{

//   let errors = [];



//   if (!req.body.firstName)
//   {
//     errors.push({message: 'Please enter your first name.'});
//   }

//   if (!req.body.lastName)
//   {
//     errors.push({message: 'Please enter your last name.'});
//   }

//   if (!req.body.email)
//   {
//     errors.push({message: 'Please enter your email address.'});
//   }

//   if (req.body.password != req.body.confirmPassword)
//   {
//     errors.push({message: 'Password fields must match.'});
//   }

//   if (!req.body.password)
//   {
//     errors.push({message: 'Please enter a password.'});
//   }

//   if (!req.body.confirmPassword)
//   {
//     errors.push({message: 'Please confirm your password.'});
//   }

//   if (errors.length > 0)
//   {
//     res.render('home/register',
//     {
//       errors: errors,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//     });
//   }
//   else
//   {
//     let errors = [];
//     User.findOne({email: req.body.email}).then(user=>
//     {
//       if(!user)
//       {
//         const newUser = new User(
//           // {
//           //   firstName: req.body.firstName,
//           //   lastName: req.body.lastName,
//           //   email: req.body.email,
//           //   password: req.body.password
//           // }
//           _.pick(req.body, ['firstName', 'lastName', 'email', 'password'])
//         );

//         bcrypt.genSalt(10, (err, salt)=>
//         {
//           bcrypt.hash(newUser.password, salt, (err, hash)=>
//           {
//             newUser.password = hash;

//             newUser.save().then(savedUser=>
//             {
//               req.flash('success_message', 'Congratulations! You are now a member of Richmond Row.');
//               const token = jwt.sign({_id: newUser._id}, config.get('jwtPrivateKey'));
//               res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'firstName', 'email']));
//               // res.redirect('/login');
//             });


//           });
//         });
//       }
//       else
//       {
//         errors.push({message: 'That email address is unavailable.'});
//         res.render('home/register',
//         {
//           firstName: req.body.firstName,
//           lastName: req.body.lastName,
//           email: req.body.email,
//           errors: errors
//         });
//       }
//     });

//   }
// });

/*
|--------------------------------------------------------------------------
| Blog getter
|--------------------------------------------------------------------------
|
| This function gets our blog posts and renders them
| to our home page.
|
*/
router.get('/post/:slug', (req, res)=>{

  Post.findOne({slug: req.params.slug})
  .populate({path: 'comments', populate: {path: 'user', model: 'users'}})
  .populate('user')

  .then(post=>{
    Category.find({}).then(categories=>
    {
      res.render('home/post', {post: post, categories: categories});
    });
  });
});

module.exports = router;
