var User = require('../models/user.js');
var Category = require('../models/category.js');
var Post = require('../models/post.js');
var f_g_User = require('../models/facebook-google.js'); 
var config  = require('../../config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var key = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var helper = require('sendgrid').mail;
var randtoken = require('rand-token');
var cloudinary = require('cloudinary');
var multer = require('multer');
var DIR = './uploads/';



module.exports = function(app , express) {

  var user_api =  express.Router();

  /// new user

             
  user_api.use(function(req, res, next){
    var token =  req.body.token || req.param("token")  || req.headers["x-access-token"];
        if(token){
                jsonwebtoken.verify(token, key, function(err , decoded){
        if(err){
                res.status(403).send({seccess:false, message:"false"});
                }else{
                req.decoded = decoded;
                next();
                }
           });
      }else{
        res.status(403).send({seccess:false, message:"false"});
    }
 });

 

  user_api.post('/new', function(req, res){
    console.log(req.body.name)
    var d =  new Date()
     users = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
     })
     User.save(function(err){
         console.log("user...", users);
         if(err){
             res.send(err);
              return;
         }
         res.json({"massage" : "Category has been created"});
       })
  })

/// all users

  user_api.get('/',function(req,res, next) {
    User.find({}, function(err, users) {
           if(err){
               res.send(err);
           }
           res.json(users);    // body...
       });
  });

  user_api.get('/:id', function(req,res, next){
    User.findOne({_id: req.params.id}, function(err, users){
        if(err){
            res.send(err);
        }
        res.json(users)
    })
  })

 //// update user

  user_api.put('/:id', function(req, res, next){
    console.log( req.params.id)
      User.findOne({_id:req.params.id}, function(err, post){
           if(err){
               res.send(err)
           }
           user.username =  req.body.username || post.username;
           user.email =  req.body.email || post.email;
           user.password =  req.body.password || post.password;
           User.save(function(err) {
               if (err)
                   res.send(err);

               res.json({ message: ' updated!' });
           });
 

    })
})


/// delete user
user_api.delete('/:id', function(req, res, next){
    console.log( req.params.id)
        User.remove({
            _id: req.params.id
        }, function(err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });

 })


   return user_api


}