var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');

var User = require('../models/users');

// Login
router.get('/', function(req, res) {
    res.render('login', { layout: false });
});

// Register
router.get('/register', function(req, res) {
    res.render('register', { layout: false });
});

// Generate Password Token
router.get('/forgot', function(req, res) {
    res.render('forgot', { layout: false });
});

//Enter New Password
router.get('/reset/:token', function(req, res) {
    User.getTokensDetails(req, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user,
            layout: false
        });
    });
});


router.post('/login', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/', failureFlash: true }),
    function(req, res) {
        res.redirect('/index');
    }
);

// Register User
router.post('/register', function(req, res) {
    var companyname = req.body.companyname;
    var companyaddress = req.body.companyaddress;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('companyname', 'Company Name is required').notEmpty();
    req.checkBody('companyaddress', 'Company Address is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            companyname: companyname,
            companyaddress: companyaddress,
            email: email,
            username: username,
            password: password,
            password2: password2
        });

        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/');
    }
});

//Get Email And Send Link
router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.getUserByEmail(req.body.email, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'akinlekan@gmail.com',
                    pass: 'motherland13'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'no-reply@goinvoice.com',
                subject: 'Password Reset Link',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
                    'Please Note: Link is Only Vaild for one Hour.'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

//Change Password
router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired. Link Timeout!');
                    return res.redirect('/forgot');
                } else {
                    var password = req.body.password;
                    var password2 = req.body.password2;

                    // Validation
                    req.checkBody('password', 'Password is required').notEmpty();
                    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

                    var errors = req.validationErrors();
                    if (errors) {
                        res.render('reset', {
                            errors: errors
                        });
                    } else {
                        user.password = password;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    }
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'akinlekan@gmail.com',
                    pass: 'motherland13'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success_msg', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

router.get('/logout', function(req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/');
});

//Password Auth
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = router;