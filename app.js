const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const sessions = require('express-session');
const upload = require('express-fileupload');
const busboy = require('connect-busboy');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

app.use(busboy());

app.use(sessions({
  name: 'sid',
  secret: config.get('jwtPrivateKey'),
  resave: false,
  
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    secure: false
  }
}));

if (!config.get('jwtPrivateKey'))
{
  console.log('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// Connect to DB

mongoose.Promise = global.Promise;
mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then((db)=>{

  console.log('MONGO Connected')

}).catch(error=> console.log("COULD NOT CONNECT TO MONGO" + error));

app.use(express.static(path.join(__dirname, 'public')));

// Load handler functions

const {select, generateDate, paginate} = require('./helpers/handlebars-helpers');

// Set View Engine

app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateDate: generateDate, paginate: paginate}}));
app.set('view engine', 'handlebars');

// Upload Middleware

app.use(upload());

// Body Parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Method Override

app.use(methodOverride('_method'));

// Load sessions

app.use(sessions(
  {
    secret: 'anthonylasochalovesparties',
    resave: true,
    saveUninitialized: true
  }
));

// Load flash

app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Loacal Variables using Middleware

app.use((req, res, next)=>
{
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash(`success_message`);
  res.locals.error_message = req.flash('error_message');
  res.locals.form_errors = req.flash('form_errors');
  res.locals.error = req.flash('error');
  next();
});

// Load Routes

const auth = require('./routes/auth');
const home = require('./routes/home/index');
const logout = require('./routes/logout');
const users = require('./routes/home/users');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

// Use Routes

app.use('/', home);
app.use('/auth', auth);
app.use('/home/users', users);
app.use('/logout', logout);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);


app.listen(4500, ()=>{

  console.log(`listening on port 4500`);
});
