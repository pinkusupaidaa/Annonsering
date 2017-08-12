const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    //let user = JSON.parse(localStorage.getItem('user'));
  res.render('index',
      {
          page: 'myAccount',
          user: req.user
      });
});

 function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next(); // 'next()', basically keep going
    }else{
        req.flash('danger', 'Du är inte inloggad');
        res.redirect('/users/login');
    }
}

module.exports = router;
