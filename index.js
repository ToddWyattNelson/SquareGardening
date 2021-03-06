// Author: Wyatt Nelson 
// 
// Descrpition: This application will allow multipule user to create and plan gardens. 
// 

const express = require('express'); // So we don't have to write our own server logic
const mongoose = require("mongoose"); // This allows uconss to run the server and connect to mongoDB
const path = require('path'); // TODO what does this do?
const cors = require('cors'); // Place this with other requires (like 'path' and 'express')
const flash = require('connect-flash');
const csrf = require('csurf');

const session = require('express-session');
const MongoDBGarden = require('connect-mongodb-session')(session);

const authRoutes = require('./routes/auth');
const gardenRoutes = require('./routes/garden');

const bodyParser = require('body-parser'); // TODO what does this do?


//sets up way for us to handle middleware
const app = express();

const csrfProtection = csrf();

const corsOptions = {
  origin: "https://square--gardening.herokuapp.com//",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// TODO What does this do?
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};


// So we can run on heroku || (OR) localhost:5000
const PORT = process.env.PORT || 5000
// Our URl to our server
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://CSE_341_users:Mceudc0XYM4dtof9@cluster0-xcgyf.mongodb.net/Square_Gardening";

// this will allow us to work with seesions
const garden = new MongoDBGarden({
  uri: MONGODB_URL,
  collection: "sessions"
  // TODO add expire
});

const User = require('./models/user');

// TODO what does this do again?
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser({ extended: false }));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: garden
  })
);

//CSRF Token
app.use(csrfProtection);

// Using Flash
app.use(flash());

// So I don't have to keep adding isAuthenticated and csrfToken
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Our routes
// So we can use a user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(gardenRoutes);
app.use(authRoutes);

app
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last. 
    res.render('pages/home', { pageTitle: 'Home', path: '/', isAuthenticated: req.session.isLoggedIn });
  })

  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', { pageTitle: '404 - Page Not Found', path: req.url })
  })

// start the server
mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });