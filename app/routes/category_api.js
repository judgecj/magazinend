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

    var category_api = express.Router();


    /// new category
    category_api.post('/new', function(err, category){

    })


///  all category


    category_api.get('/', function(req, res, next){
        Category.find({}, function(err, category) {
             if(err){
                   res.send(err);
               }
               res.json(category);    // body...
        });
    })

// show r git data 

  category_api.get('/:id', function(req, res){
    Category.findOne({_id: req.params.id}, function(err, post){
        if(err){
            res.send(err);
        }
        res.json(category)
    })
  })
  
  
/// update category

  category_api.put('/:id', function(req, res, next){
    console.log( req.params.id)
    Category.findOne({_id:req.params.id}, function(err, category){
           if(err){
               res.send(err)
           }
           category.body = req.body.body || post.body;
           category.title = req.body.title  || post.title;
           category.category_id = req.body.category_id|| post.category_id;
           category.name = req.body.name || post.name
           category.save(function(err) {
               if (err)
                   res.send(err);

               res.json({ message: ' updated!' });
           });
    })
})
       



       
     /// delete category

    category_api.delete('/:id', function(req, res, next){
        console.log( req.params.id)
            Category.remove({
                _id: req.params.id
            }, function(err, category) {
                if (err)
                    res.send(err);
                res.json({ message: 'Successfully deleted' });
            });

    })








  
   return category_api
}    