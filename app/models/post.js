 var mongose = require('mongoose');

  var  Schema = mongose.Schema;
 var bcrypt = require('bcrypt-nodejs');
  var PostSchema =  new Schema({
            
             ///user_id :{type: Schema.Types.ObjectId, ref: 'User'},
             body: String,
             title : String,
             name :String,
             image :String,
             url:String,
             created_at: String
  
          
   })





 // UserSchema.methods.comparepassword = function(password){
  // var user = this;
 //  return  bcrypt.compareSync(password, user.password);
 //}
//UserSchema.methods.comparePassword = function(password) {
 // var user = this;

// return bcrypt.compareSync(password, user.password);



module.exports = mongose.model('Post', PostSchema);    