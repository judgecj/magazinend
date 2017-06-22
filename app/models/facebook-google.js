 var mongose = require('mongoose');

  var  Schema = mongose.Schema;
 var bcrypt = require('bcrypt-nodejs');
  var UserSchema =  new Schema({
     facebook: {
             id: String,
             token: String,
             email: String,
             name: String,
            username: String,
        },
        google: {
                id: String,
                token: String,
                email: String,
                name: String,
        },
       
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

  


module.exports = mongose.model('f_g_User', UserSchema);    