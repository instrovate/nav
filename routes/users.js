const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('flash-express');
const key = require('./hadoopongcp-260305-aee116b22e5b.json');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    type: 'OAuth2',

      user: 'info@instrovate.com',
      serviceClient: key.client_id,
      privateKey: key.private_key
  }
});



// Passport Config
require('../config/passport')(passport);

// Passport middleware
router.use(passport.initialize());
router.use(passport.session());



// Load User model
//const User = require('../model/user.model');
var User = mongoose.model("User");
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('user/login'));
router.get('/registration-success', (req,res)=>res.render('user/registration-success'));
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('user/register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, phone, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !phone || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('user/register', {
      errors,
      name,
      phone,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('user/register', {
          errors,
          name,
          phone,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          phone,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                transporter.sendMail({
from: 'info@instrovate.com',
to:newUser.email,
subject:'Registration Confirmation',
html:'Your Registration is successful. Please login at <a href="http://lms.instrovate.com">lms.instrovate.com</a>',
                });
                res.redirect('/users/registration-success');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    //failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  //req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;