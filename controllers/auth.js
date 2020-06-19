
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // let message = req.flash('error');
  // if (message.length > 0) {
  //   message = message[0];
  // } else {
  //   message = null;
  // }
  
  res.render('pages/auth/login', {
    isAuthenticated: req.session.isLoggedIn,
    path: '/login',
    pageTitle: 'Login',
    //   errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).render('auth/login', {
  //     path: '/login',
  //     pageTitle: 'Login',
  //     errorMessage: errors.array()[0].msg,
  //     oldInput: {
  //       email: email,
  //       password: password
  //     },
  //     validationErrors: errors.array()
  //   });
  // }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('pages/auth/login', {
          isAuthenticated: req.session.isLoggedIn,
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log("pass word match");
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('pages/auth/login', {
            isAuthenticated: req.session.isLoggedIn,
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};



exports.getSignup = (req, res, next) => {
  // let message = req.flash('error');
  // if (message.length > 0) {
  //   message = message[0];
  // } else {
  //   message = null;
  // }
  res.render('pages/auth/signup', {
    isAuthenticated: req.session.isLoggedIn,
    path: '/signup',
    pageTitle: 'Signup',
    // errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

//make new user
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422)
  //     .render('pages/proveAssignments/prove03view/signup', {
  //       path: '/signup',
  //       pageTitle: "Signup",
  //       isAuthenticated: false,
  //       errorMessage: errors.array()[0].msg,
  //       oldInput: {
  //         email: email,
  //         password: password,
  //         confirmPassword: req.body.confirmPassword
  //       }
  //     });
  // }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      // return transporter.sendMail({
      //   to: email,
      //   from: "tstnlsn@gmail.com",
      //   subject: "Signup Succeeded!",
      //   html: "<h1> You successfully signed up!</h1>"
      // });
    })
    .catch(err => {
      console.log(err)
    });

};

exports.postlogout = (req, res, next) => {
  req.session.destroy(err => {
      console.log(err);
      res.redirect('/login');
  });
};