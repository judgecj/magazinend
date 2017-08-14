 var express = require('express');
 var bodyParser = require('body-parser');
 var morgan = require('morgan');
 var mongose = require('mongoose');
 var MongoClient = require('mongodb').MongoClient;
 var config = require('./config');
 var body = require('body-parser');
 const cors = require('cors');
  const helmet = require('helmet');

  var http = require('http');
  app = express();
  app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

  //   http.createServer(function (request, response) {
  //   response.writeHead(200, {
  //       'Content-Type': 'text/plain',
  //       'Access-Control-Allow-Origin' : '*',
  //       'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  //       'Content-Type': 'application/json',
  //           'Access-Control-Allow-Origin': '*'
  //   });
  // });
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


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
 		console.log("post 3000 loading .........")
 	}

 })
 