var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var mysql = require('mysql2/promise');
var corsOptions = {
  origin: true,
  method:['GET', 'PUT', 'POST'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var getConnection = function(){
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Xiao7Xiao8',
    database: 'cruisrgestion'
  });
}
var queryDB = function(res,queryString){
  var connection = getConnection();
  connection.then((conn) => conn.query(queryString))
  .then(([rows, fields]) => {
    console.log("return query data");
    res.end(JSON.stringify(rows));
  })
  .catch((err)=> {
    console.log(err);
    res.sendStatus(400);
  });
};
app.use(cors(corsOptions));


app.get('/contrats', function (req, res) {
  queryDB(res,'select * from contrats');
})
app.get('/utilisateurs', function (req, res) {
  queryDB(res,'SELECT * FROM `users`');
})
app.get('/profils', function (req, res) {
  queryDB(res,'SELECT * FROM `profils`');
})
//Profils
app.delete('/profils', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'DELETE FROM `profils` WHERE `profils`.`id_profil` = \''+ data["id_profil"]+'\';';
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/profils', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `profils` SET `lib_profil` = \''+data["lib_profil"] +'\' WHERE `profils`.`id_profil` = \''+data["id_profil"]+"\';";
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.post('/profils', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'INSERT INTO `profils` (`id_profil`, `lib_profil`) VALUES (\''+data["id_profil"]+'\',\''+data["lib_profil"]+'\');';
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.get('/clients', function (req, res) {
  queryDB(res,'SELECT * FROM `clients`');
})
app.get('/batteries', function (req, res) {
  queryDB(res,'SELECT * FROM `batteries`');
})
app.get('/chargeurs', function (req, res) {
  queryDB(res,'SELECT * FROM `chargeurs`');
})
app.get('/scooters', function (req, res) {
  queryDB(res,'SELECT * FROM `scooters`');
})
app.get('/statuts', function (req, res) {
  queryDB(res,'SELECT * FROM `statuts`');
})
app.get('/users', function (req, res) {
  queryDB(res,'SELECT * FROM `users`');
})

app.get('/contrats/name=:name&&id=:id', function (req, res) {
  console.log("get contrats by name",req.params);
  res.end();
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at localhost", host, port)

})
