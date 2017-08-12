const express = require('express');
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const flash = require('connect-flash');
const User = require('../models/user');
const Advertisement = require('../models/advertise');
const router = express.Router();


function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next(); // 'next()', basically keep going
    }else{
        req.flash('danger', 'Du är inte inloggad');
        res.redirect('/users/login');
    }
}

// Register
router.get('/register', function (req, res, next) {
    res.render('index',
        {
            page:'register'
        }
    )
});

// Login
router.get('/login', function (req, res, next) {
    res.render('index',
        {
            page: 'login',
            message: req.flash('error')
        }
    );
});

router.post('/register', function (req, res, next) {
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
        //shit =
        User.createUser(newUser, (err, user) => {
            if(err){
                throw err;
                //res.json({success: false, msg: 'Failed to register user' });
            }
        });
        req.flash('success', 'Du är registrerad och kan logga in');
        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'}); // som det stod innan "{message: 'Unknown User'});"
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else {
                    return done(null, false, {message: 'Invalid Password'});
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

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    const zeMessage = req.flash('success', 'Du är nu utloggad');
    res.render('index',
        {
            message: zeMessage,
            page: 'login'
        });
});

router.get('/myAds', ensureAuthenticated, function (req, res) {
    Advertisement.find({userId: req.user._id}, function (err, ads) {
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                page: 'myAds',
                ads: ads
            });
        }
    });
});

router.get('/newAd', ensureAuthenticated, function (req, res) {
   res.render('index',{
       page: 'newAd',
       cities: require('../cities.json')
   });
});

// Visa alla annonser, Ingen sortering just nu.
router.get('/allAdds', ensureAuthenticated, function (req, res) {
   Advertisement.find({}, function (err, adds) {
       if(err){
           console.log(err);
       }else{
           res.render('index', {
               page: 'allAdds',
               adds: adds,
               cities: require('../cities.json')
           });
       }
   });
});

// Visa sida för en annons
router.get('/allAdds/singleAdd/:id', function (req, res) {
    Advertisement.findById(req.params.id, function (err, oneAdd) {
        if(err){
            console.log(err);
        }else{
            res.render('index',
                {
                    page:'singleAdd',
                    oneAdd:oneAdd,
                    user:req.user
                });
        }
    });
});

// Redigera en annons
router.get('/allAdds/singleAdd/edit/:id', function (req, res) {
    Advertisement.findById(req.params.id, function (err, oneAdd) {
        if(err){
            console.log(err);
        }else{
            res.render('index',
                {
                    page:'edit_ad',
                    oneAdd:oneAdd,
                    cities: require('../cities.json')
                });
        }
    });
});
// KOD FÖR UPPLADDNING TILL DISK
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg') // + '-' + Date.now()
    }
});

const upload = multer({ storage: storage }); //.single('image1');

//Spara redigerad annons
router.post('/allAdds/singleAdd/edit/:id', upload.any(), function (req, res) {
    console.log(req.body.city);
    console.log(req.files.length);
    let ad = {};
    ad.city = req.body.city;
    ad.category = req.body.category;
    ad.description = req.body.description;
    console.log(ad);
    if(req.files.length > 0){
        ad.images = [];
        console.log(req.files[0].filename)
        for(i = 0; i < req.files.length; i++){
            ad.images[i] = req.files[i].filename;
        }
    }
    console.log(ad);

    let query = {_id: req.params.id};

    Advertisement.update(query, ad, function (err) {
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

// Ta bort en annons
router.delete('/allAdds/singleAdd/:id', function (req, res) {
    let query = {_id:req.params.id};
    Advertisement.remove(query, function (err) {
       if(err){
           console.log(err);
       }
       res.send('Success');
    });
});

router.post('/newAd',upload.any(), function (req, res) {
    console.log(req.body.city);
    console.log(req.files.length);

    let add = Advertisement({
        city: req.body.city,
        category: req.body.category,
        description: req.body.description,
        userId: req.user._id
    });

    for(i = 0; i < req.files.length; i++){
        add.images[i] = req.files[i].filename;
    }

    add.save(function (err) {
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Annonsen Är Tillagd =)');
            res.redirect('/users/MyAds');
        }
    });
});

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profileImages/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg') // + '-' + Date.now()
    }
});

const upload2 = multer({ storage: storage2 }).single('avatar');

router.get('/myAccount/edit', ensureAuthenticated, function (req, res) {
   res.render('index',
       {
          page: 'edit_profile',
           user: req.user
       });
});

//Function för problemet med "Unexpected token _ in JSON at position 2"
function escapeSpecialChars(jsonString) {

    return jsonString.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f");

}

router.post('/myAccount/edit', upload2, ensureAuthenticated, function (req, res) {
    let user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;

    if(req.file != undefined){
        user.avatar = req.file.filename; //req.file.destination +
    }
    else{

    }

    let query = {_id: req.user._id};

    User.update(query, user, function (err) {
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

module.exports = router;
