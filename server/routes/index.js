var express = require('express');
var router = express.Router();
let passport = require('passport'); 
let userModel = require("../models/user")
let User = userModel.User
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', 
  displayName: req.user ? req.user.displayName:''
});
});

//get login page
router.get('/login', function(req, res,next) {
  if (!req.user)
    {
        res.render('auth/login',
        {
            title: 'Login',
            message: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName: ''
        })
    }
    else
    {
        return res.redirect('/')
    }
  });

//post login page
router.post('/login',function(req, res,next){
  passport.authenticate('local',(err,user,info) =>
  {
    if(err)
    {
        return next(err);
    }
    if(!user)
    {
        req.flash('loginMessage',
        'AuthenticationError');
        return res.redirect('/login');
    }
    req.login(user,(err) => {
      if(err)
      {
          return next(err)
      }
      return res.redirect('/uni-day');
    })
    
    })(req,res,next)

})
//get registration page
router.get('/register', function(req, res, next){
  if(!req.user){
    res.render('auth/register',
    {
      title: 'Register',
      message: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName: ''
    })
  }
  else
  {
    return res.redirect('/')
  }
})

//post registration page
router.post('/register', function(req, res, next){
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password,
    email:req.body.email,
    displayName: req.body.displayName
})
User.register(newUser, req.body.password, (err) =>{
    if(err)
    {
        console.log("Error: Inserting the new user");
        if(err.name=="UserExistsError")
            {
                req.flash('registerMessage',
                'Registration Error: User Already Exists');
            }
        return res.render('auth/register',
        {
            title:'Register',
            message: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName:''
        });
      }
      else
        {
          return passport.authenticate('local')(req,res,()=>{
            res.redirect('/uni-day');
          })
        }
  })
})
  

//get logout page
router.get('/logout',function(req, res, next)
{
  req.logout(function(err){
    if(err){
      return next(err)
    }
  
})
  res.redirect('/')
})

module.exports = router;

