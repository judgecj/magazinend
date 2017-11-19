 var mongose = require('mongoose');

  var  Schema = mongose.Schema;
  var bcrypt = require('bcrypt-nodejs');
  var UserSchema =  new Schema({
            
            resetPasswordToken: String,
            resetPasswordExpires : String,
            email:{type:String, unique:true, index:{unique :true}},
            username: { type: String, required:true, index: {unique :true} },
            password: { type: String, select:false}
          
   })



 UserSchema.pre('save', function(next) {
  	var user = this;
  	if(!user.isModified('password')) return next();
     bcrypt.hash(user.password, null, null, function(err, hash){
     	if(err)return next(err);
     	user.password = hash;
     	next();
     });     

  });    


  UserSchema.methods.validPassword = function(password) {
           return  bcrypt.compareSync(password, this.password);
  };

 // UserSchema.methods.comparepassword = function(password){
  // var user = this;
 //  return  bcrypt.compareSync(password, user.password);
 //}
//UserSchema.methods.comparePassword = function(password) {
 // var user = this;

// return bcrypt.compareSync(password, user.password);
//}
  UserSchema.methods.getUserbyUsername = function(username){
      var query = {username: username};
       
  }

    UserSchema.methods.getUserById = function(id, callback){
       UserSchema.findById(id, callback);
  }

   UserSchema.methods.comarePassword = function(candidatepassword, hash, callback){
      bcrypt.compare(candidatepassword,hash, function(err,isMatch){
         if(err) throw err;
          callback(null, isMatch);
      }) ;
  }


module.exports = mongose.model('User', UserSchema);    