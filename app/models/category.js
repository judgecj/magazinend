var mongose = require('mongoose');
var  Schema = mongose.Schema;

 var CategorySchema = new Schema({
          name:String,
          created_at: String
 })

 module.exports = mongose.model('Category', CategorySchema);   