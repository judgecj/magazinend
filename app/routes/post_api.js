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

    var post_api = express.Router();



    /// new

    post_api.post('/new', function (req, res, next) {
        
                var path = '';
                  upload(req, res, function (err) {
                    if (err) {
                        // An error occurred when uploading
                        console.log(err);
                        return res.status(422).send("an Error occured")
                    }
                //     // No error occured.
                    console.log("JHDFKUYSJF",path = req.file.path);
                    cloudinary.uploader.upload(path, function(result, req) {
                        
                       return res.json({"result":result.url});   
                    });
                 
                    
                });
      });

      /// all posts
     
      post_api.get('/',function(req,res, next) {
        Post.find({}, function(err, posts) {
               if(err){
                   res.send(err);
               }
               res.json(posts);    // body...
           });
     });

     /// get by id post

     post_api.get('/:id', function(req,res, next){
         Post.findOne({_id: req.params.id}, function(err, post){
             if(err){
                 res.send(err);
             }
             res.json(post)
         })
     })

     /// update post

     post_api.put('/:id', function(req, res, next){
         console.log( req.params.id)
         Post.findOne({_id:req.params.id}, function(err, post){
                if(err){
                    res.send(err)
                }
                post.body = req.body.body || post.body;
                post.title = req.body.title  || post.title;
                post.category_id = req.body.category_id|| post.category_id;
                post.name = req.body.name || post.name
                post.save(function(err) {
                    if (err)
                        res.send(err);
    
                    res.json({ message: ' updated!' });
                });
      

         })
     })


     /// delete

     post_api.delete('/:id', function(req, res, next){
        console.log( req.params.id)
            Post.remove({
                _id: req.params.id
            }, function(err, bear) {
                if (err)
                    res.send(err);
                res.json({ message: 'Successfully deleted' });
            });

     })
      
     




    return post_api 
    
}