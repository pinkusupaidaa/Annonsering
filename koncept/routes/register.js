const express = require('express');
const router = express.Router();
const User = require('../models/user');

/*router.get('/', function (req, res, next) {
    res.render('register',
        {nameOfSite: "Registrera nytt konto"}
    )
});*/

/*router.post('/register', function (req, res, next) {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;
    console.log(name);

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if(errors){
        res.render('index', {
            errors:errors,
            page: 'register'
        });
        console.log(errors[0].msg);
    }else {
        let newUser = User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        // Är det här verkligen en bra lösning för att kolla om användarnamn / email redan finns?
        shit = User.createUser(newUser, (err, user, derp) => {
            if(err){
                throw err;
                //res.json({success: false, msg: 'Failed to register user' });
            }else{
                if(derp){
                    req.flash('success', 'Du är registrerad och kan logga in.');
                    res.redirect('/users/login');
                }else{
                    req.flash('danger', 'Användarnamnet finns redan');
                    res.redirect('/users/register');
                }
            }
        });
        if(shit){
            req.flash('success', 'Du är registrerad och kan logga in.');
            res.redirect('/users/login');
        }else{
            req.flash('danger', 'Användarnamn finns redan');
            res.redirect('/users/register');
        }

    }
});*/

// Register
router.post('/', function (req, res, next) {
   let newUser = User ({
      name: req.body.name,
       email: req.body.email,
       username: req.body.username,
       password: req.body.password
   });

   shit = User.addUser(newUser, (err, user) => {
       if(err){
           res.json({success: false, msg: 'Failed to register user' });
       }else{
           res.json({success: true, msg: 'User registerd' });
       }
   });
   if(shit){
       console.log(shit);
   }
   else{
       console.log('fuck off');
   }
});

module.exports = router;