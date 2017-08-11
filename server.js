var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var mysql = require('mysql2/promise');
var mysqlFunction = require('mysql2');
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
    database: 'cruisrgestion',
    multipleStatements: true
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
//data base : users
//get user data
app.get('/utilisateurs', function (req, res) {
  queryDB(res,'SELECT * FROM `users`');
})
//delete user data
app.delete('/utilisateurs', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'DELETE FROM `users` WHERE `users`.`id_user` = ?;';
  let inserts = [data['id_user']];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//add new user
app.post('/utilisateurs',jsonParser, function (req, res) {
  let data = req.body;
  let timeString = new Date().toJSON().split('T')[0];
  let statut = 1;
  console.log("data",data);
  let queryString = 'INSERT INTO `users` (`id_user`, `nom`, `prenom`, `societe`, `username`, `password`, `email`, `tel`, `statut`, `profil`, `dateajout`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  let inserts = [null,data['nom'],data['prenom'],data['societe'],data['username'],data['motdepasse'],data['email'],data['tel'],statut,data['profil'],timeString];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//modify user data
app.put('/utilisateurs',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `users` SET `nom` = ? ,`prenom` = ? , `societe` = ? ,`username` = ? ,`password` = ? ,`email` = ? , `tel` = ? , `profil` = ?  WHERE `users`.`id_user` = ?';
  let inserts = [data["nom"],data["prenom"],data["societe"],data["username"],data["password"],data["email"],data["tel"],data["profil"],data["id_user"]];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//Profils
//get all profil
app.get('/profils', function (req, res) {
  queryDB(res,'SELECT * FROM `profils`');
})
//delete profil by id
app.delete('/profils', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'DELETE FROM `profils` WHERE `profils`.`id_profil` = ? ;';
  let inserts = [data["id_profil"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//updata a profil
app.put('/profils', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `profils` SET `lib_profil` = ? WHERE `profils`.`id_profil` = ?;';
  let inserts = [data["lib_profil"] ,data["id_profil"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//add a new profil
app.post('/profils', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'INSERT INTO `profils` (`id_profil`, `lib_profil`) VALUES (?,?);';
  let inserts = [data["id_profil"],data["lib_profil"]];
  queryString = mysqlFunction.format(queryString,inserts);
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
//Scooters
app.get('/scooters', function (req, res) {
  queryDB(res,'SELECT * FROM `scooters`');
})
app.post('/scooters',jsonParser, function (req, res) {
  let data = req.body;
  let timeString = new Date().toJSON().split('T')[0];
  console.log("data",data);
  let queryString = 'INSERT INTO `scooters` (`id_scooter`, `id_contrat`, `num_cruisrent`, `marque`,`modele`, `immat`, `date_immat`, `type_usage`, `composants`, `num_chassis`, `nb_kms`, `controle_qualite`, `num_contratassurance`, `assureur`, `debut_assurance`, `duree_assurance`, `statut`, `actif`, `date_ajout`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  let inserts = [
    null,null,data["num_cruisrent"],data["marque"],data["modele"],
    data["immat"],data["date_immat"],data["type_usage"],data["composants"],data["num_chassis"],
    data["nb_kms"],data["controle_qualite"],data["num_contratassurance"],data["assureur"],
    data["debut_assurance"],data["duree_assurance"],data["statut"],0,timeString];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.post('/scooters/boitier',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let boiter = data['boitierModalType']===1?data['id_boitier']:null;
  let actif = data['boitierModalType']===1?1:0;
  let queryString = 'UPDATE `scooters` SET `id_boitier` = ?, `actif` = ? WHERE `scooters`.`id_scooter` = ?';
  let inserts = [boiter,actif,data["id_scooter"]];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.post('/scooters/contrat',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString;
  let queryStringComplement='';
  if (data['contratModalType']===1) {
    queryString = 'UPDATE `scooters` SET `id_contrat` = ? WHERE `scooters`.`id_scooter` = ?';
    let inserts = [data['id_contrat'],data["id_scooter"]];
    queryString = mysqlFunction.format(queryString, inserts);
  }else {
    queryString = 'UPDATE `scooters` SET `id_contrat` = ?, `statut` = ? WHERE `scooters`.`id_scooter` = ? ;';
    let inserts = [null,data['statut'],data["id_scooter"]];
    queryString = mysqlFunction.format(queryString, inserts);
    if(data['isAttribuerScooter']){
      queryStringComplement = 'UPDATE `scooters` SET `id_contrat` = ? WHERE `scooters`.`id_scooter` = ? ;';
      let insertsComplement = [data['id_contrat'],data["id_scooter_new"]];
      queryStringComplement = mysqlFunction.format(queryStringComplement, insertsComplement);
    }
    queryString = queryString.concat(queryStringComplement);
  }
  console.log("queryString",queryString);
  queryDB(res,queryString);
})

//
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
