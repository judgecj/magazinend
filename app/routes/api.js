   var User = require('../models/user.js');
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
 function createToken(user) {
	var token  = jsonwebtoken.sign({
		_id:  user._id,
		name: user.name,
		username : user.username

	},key,{
	 expiresIn: 30000
	})
	return token
   }

module.exports = function(app , express) {

     var api = express.Router();

  /// Sign up
  api.post("/signup", function(req, res){
        var user = new User ({
      	   name: req.body.name,
   	       username: req.body.username,
           email: req.body.email,
   	       password: req.body.password,
        });
      console.log("user signup", user);
       user.save(function(err){
            console.log("user...", user);
            if(err){
                res.send(err);
   	  	         return;
            }
            res.json({"massage" : "User has been created"});
       })
  });


   // router facebok 
    
  
    

    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : config.facebookAuth.clientID,
        clientSecret    : config.facebookAuth.clientSecret,
        callbackURL     : config.facebookAuth.callbackURL,
        profileFields: ['id', 'email', 'first_name', 'last_name']
      },

    // facebook will send back the token and profile
     function(token, refreshToken, profile, done) {
        // asynchronous
            console.log('within local strategy');
        process.nextTick(function() {
                console.log('within local strategy 3');
            // find the user in the database based on their facebook id
            f_g_User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                  console.log("first users", user); 
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                console.log("2 users", user); 
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                      console.log("first users", user); 
                    // if there is no user found with that facebook id, create them
                           
             var newUser = new f_g_User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = (profile.emails || '').toLowerCase();

               newUser.save(function(err) {
                        if (err)
                        throw err;
                        return done(null, newUser);
                    });
                }

            });
        });

    }));


  /// Facebook login
       


   // facebook will send back the token and profile
   
    api.get('/auth/facebook/',  passport.authenticate('facebook'),
      function(req, res){
    // The request will be redirected to Facebook for authentication, with
    // extended permissions.
    
     });;
    // handle the callback after facebook has authenticated the user
    
      api.get('/auth/facebook/callback',  function(req, res, next){
            passport.authenticate('facebook',  function(err, user, info){ 
            if(err){
                 next(err);
                    } else if(!user){
                        res.json({"status": "error", "message": info });
                    } else {
                        var token =  createToken(user);
                        res.json({
                        status :"true",
                        message :"seccess loging",
                        "data": user ,
                        token : token
                    })
                    }
                })(req, res, next);
      });
      
   

   
      /// all User 
        api.post('/login', function(req, res, next) {
                 passport.authenticate('local', function(err, user, info){
                    if(err){
                        next(err);
                    } else if(!user){
                      
                        res.json({"status": "error", "message": info });
                    } else {
                        
                        var token =  createToken(user);
                        res.json({
                        status :"true",
                        message :"seccess loging",
                        "data": user ,
                        token : token
                    })
                    }
                })(req, res, next);
                                                    
        });         
   

   //sign sign in
   passport.use(new LocalStrategy({
         passReqToCallback : true,
           session: true,
        emailField: 'email',
        passwordField: 'password'
        
            },
            function(req, username, password, done) {
                var unhashedPassword = password;
                var passedEmail = username;
           console.log("dhfgbabuierofbj")
                 User.findOne({ email: passedEmail }).select('password').exec(function (err, user)  {
                     if (err) {
                          console.log('Error:', err);
                          return done(err); 
                        }
                     console.log('within local strategy', user);
                        if (!user) {
                                console.log('Incorrect email:');
                                return done(null, false, { message: 'Incorrect email.' });
                         }
                       console.log("userpass", unhashedPassword);   
                    bcrypt.compare(password, user.password, function (err, response) {
                        if (!response) {
                            console.log('Invalid Password');
                             return done(null, false, { message: 'Incorrect username.' });
                        }else{
                             var token =  createToken(user);
                             var returnUser = {
                                    name: user.name,
                                    email: user.email,
                                    createdAt: user.createdAt,
                                    id: user.id
                              };
                              
                              console.log('Returning User: ' + returnUser);
                              console.log('User: ' + token);
                                return  done(null, returnUser);
                        }
                        // User and password both match, return user from 
                        // done method which will be treated like success
                        });
                     });   
               }
            ));
            


     api.get('/auth/google', passport.authenticate('google', { scope: 	['profile', 'email']  }));
 
        api.get('/auth/google/callback',function(req, res, next){
            passport.authenticate('google',  function(err, user, info){ 
            if(err){
                        next(err);
                    } else if(!user){
                        res.json({"status": "error", "message": info });
                    } else {
                        var token =  createToken(user);
                        res.json({
                        status :"true",
                        message :"seccess loging",
                        "data": user ,
                        token : token
                    })
                    }
                })(req, res, next);
      });



   
            /// google signin 
           passport.use(new GoogleStrategy({  
                clientID   : config.googleAuth.clientID,
              clientSecret : config.googleAuth.clientSecret,
               callbackURL : config.googleAuth.callbackURL,
            },
                function(token, refreshToken, profile, done) {
                process.nextTick(function() {
                    f_g_User.findOne({ 'google.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new f_g_User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                        });
                      }
                    });
                });
            }));
 


      // get token 
      api.get('/reset/:token', function(req, res) {
       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
         if (!user) {
           console.log('error', 'Password reset token is invalid or has expired.');
          };
           console.log(user);
           console.log("judge like",  user.resetPasswordToken);
           res.redirect("/api/passwordset"+ '?token= ' +user.resetPasswordToken)
            
           });
      })

        api.post('/passwordset',  function(req, res){
          User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }, function(err , user) {
             if(!user){
                console.log("user not found ");
             }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;  
            user.save(function(err) {
              if(err){
                  console.log('data not save')
              }
              chengePasswordEmil(user);
            });
  
          }})
            console.log(req.query.token);
            res.send(req.query.token)
        });    
     // forget password router 

       api.post('/password_reset',  function(req, res,  next){
        var token = randtoken.generate(300);
         var header =   req.headers.host;
         User.findOne({ email: req.body.email },function (err, user)  {
            if(err) throw err ;
            if(!user){
             console.log("no users found")
            }
              console.log(user.password);
              user.eamil = req.body.email || user.email;
                user.username = req.body.username  || user.username;
                user.name = req.body.name|| user.name;
                user.resetPasswordToken = token || user.resetPasswordToken;
                user. resetPasswordExpires = Date.now() + 3600000 || user. resetPasswordExpires;
                user.save(function (err, user) {
                    if (err) {
                        res.status(500).send(err)
                    }
                     endmail(user, header);
                    res.send(user);
                });
            });  
       });

      

     // recoverde password email        
        function endmail(user, header)  {
            console.log("judge love",user, header);
            var nodemailer = require('nodemailer');
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                        auth: {
                            user: 'judgechuks@gmail.com',
                            pass: 'Chukwuka1'
                        }
                    });
                    header ="localhost:2000";
                     console.log(header)
                    var mailOptions = {
                        from: 'obirijejohn@gmailcom',
                        to: 'judgechuks@gmail.com',
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!',
                        html: '<div style="background-color:black;color:white;padding:20px;">' 
                        + 'http://' + header +'/api/reset/'+ user.resetPasswordToken  +  '</div> '
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                   });
              
      }
          
        
     // recoverde password email        
        function  chengePasswordEmil(user)  {
            console.log("chengePasswordEmil",user, header);
        var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                service: 'gmail',
                    auth: {
                        user: 'judgechuks@gmail.com',
                        pass: 'Chukwuka1'
                    }
                });

                var mailOptions = {
                    from: 'obirijejohn@gmailcom',
                    to: user.email,
                    subject: 'Sending Email using Node.js',
                    text: 'That was easy!',
                    html: '<div style="background-color:black;color:white;padding:20px;"> <h2>London'+ 
                    '<a href="' + user.username + '/api/reset/' +user.email+ '\n\n' +'/> \n\n' +'</p></div> '
                };

                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
                });
              
      }  

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
            if(err) done(err);
                if(user){
                done(null,user);
            }else{
                User.findById(id, function(err,user){
                if(err) done(err);
            done(null,user);
                });
            }
        });


    
           
          //  function comparepassword(password){
               //      var user = this;
          ///    return  bcrypt.compareSync(password, user.password);
        // }
           
    api.use(function(req, res, next){
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

     

        
       
        api.get("/users", function(req , res) {
            User.find({}, function(err, users) {
                if(err){
                    res.send(err);
                }
                res.json(users); 		// body...
            });
        });


            api.get("/", function(req , res) {
              res.json("welcome");
            })



  return api    

}


 