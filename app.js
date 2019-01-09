var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require("fs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser());

var data;
fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data_r) {
  data = JSON.parse(data_r);
});


app.get('/listUsers', function (req, res) {
  // Get all users
  res.send(data);
});

app.get('/showbyID/:id', (req, res) => {
  // Get user by ID
  var keys = Object.keys(data);
  var id = req.params.id;
  var found = false;
  var user = {};
  for(key in keys){
    if(data[keys[key]].id == id){
      user[keys[key]] = data[keys[key]];
      found = true;
    }
  }
  if(found){
    // Found user
    res.send(user);
  }else{
    // User not found
    res.send("UserID = "+id+" not found");
  }
});



app.post('/addUser', function (req, res) {
  // Add user by pass json body data
  var keys_data = Object.keys(data);
  var body = req.body;
  if(Object.keys(body).length == 0){
    res.send("No information given");
    return
  }
  var lastElement = keys_data[keys_data.length-1];
  var nextUserId = parseInt(lastElement.replace("user", ""))+1
  var nextUser = "user"+String(nextUserId);
  body.id = nextUserId;
  data[nextUser] = body;
  res.send(data);
});

app.post('/addMultiUser', (req, res) => {
  // Add users by pass json body data
  var body = req.body;
  if(Object.keys(body).length == 0){
    res.send("No information given");
    return
  }else if(Object.keys(body).length == 1){
    var lastElement = keys_data[keys_data.length-1];
    var nextUserId = parseInt(lastElement.replace("user", ""))+1
    var nextUser = "user"+String(nextUserId);
    body.id = nextUserId;
    data[nextUser] = body;
    res.send(data);
    return;
  }else{
    body.forEach(user => {
      var keys_data = Object.keys(data);
      var lastElement = keys_data[keys_data.length-1];
      var nextUserId = parseInt(lastElement.replace("user", ""))+1
      var nextUser = "user"+String(nextUserId);
      user.id = nextUserId;
      data[nextUser] = user;
    });
    res.send(data);
    return;
  }
})

app.delete('/deleteUser/:id', function (req, res) {
  // Delete user by id
  var keys = Object.keys(data);
  var id = req.params['id'];
  var found = false;
  for(key in keys){
    if(data[keys[key]].id == req.params['id']){
      delete data[keys[key]];
      found = true;
    }
  }
  if(found){
    // Found user
    res.send(data);
  }else{
    // User not found
    res.send("UserID = "+id+" not found");
  }
})

var server = app.listen(8080, () => {
  console.log(`Server started on port: 8080`);
});

module.exports = app;
