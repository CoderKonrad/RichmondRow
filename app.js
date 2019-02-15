const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');

// Connect to DB

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cms', { useNewUrlParser: true }).then((db)=>{

  console.log('MONGO Connected')

}).catch(error=> console.log("COULD NOT CONNECT TO MONGO" + error));

app.use(express.static(path.join(__dirname, 'public')));

// Load handler functions

const {select} = require('./helpers/handlebars-helpers');

// Set View Engine

app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select}}));
app.set('view engine', 'handlebars');

// Upload Middleware

app.use(upload());

// Body Parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Method Override

app.use(methodOverride('_method'));

// Load Routes

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts')

// Use Routes

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);



app.listen(4500, ()=>{

  console.log(`listening on port 4500`);
});
