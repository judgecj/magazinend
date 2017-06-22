 var express = require('express');
 var bodyParser = require('body-parser');
 var morgan = require('morgan');
 var mongose = require('mongoose');
 var MongoClient = require('mongodb').MongoClient;
 var config = require('./config');
 var body = require('body-parser');
  
  app = express();
  app.use(body.urlencoded({extended:true}));
  app.use(body.json());
 

  //  view e
  app.use(morgan('dev')) ;
  var api = require('./app/routes/api')(app, express);
  app.use('/api', api);

  
 

var url = 'mongodb://judgechuks:chuks@ds051655.mlab.com:51655/userme';

  // db connect
mongose.connect('mongodb://judgechuks:chuks@ds051655.mlab.com:51655/userme');
var conn = mongose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

//mongodb://judgechuks:chuks@ds113702.mlab.com:13702/easydemo

  // app model


//server lister
 app.listen(config.port, function(err){
 	if(err){
 		console.log(err);
 	}else{
 		console.log("post 2000 loading .........")
 	}

 })
 