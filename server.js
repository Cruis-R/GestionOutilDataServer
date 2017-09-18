var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var mysql = require('mysql2/promise');
var mysqlFunction = require('mysql2');
var corsOptions = {
  origin: true,
  method:['GET', 'PUT', 'POST', 'DELETE'],
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
  var connectinHandler;
  connection.then((conn) => conn.query(queryString))
  .then(([rows, fields]) => {
    console.log("return query data");
    res.end(JSON.stringify(rows));
  })
  .catch((err)=> {
    console.log(err);
    res.sendStatus(400);
  });
  connection.then((conn) => conn.end());
};
app.use(cors(corsOptions));


app.get('/contrats', function (req, res) {
  queryDB(res,'SELECT `contrats`.*, `clients`.`societe`,`clients`.`adresse` FROM `contrats`,`clients` WHERE `contrats`.`id_client`=`clients`.`id_client`');
})
//add new contrats
app.post('/contrats',jsonParser, function (req, res) {
  let data = req.body;
  let timeString = new Date().toJSON().split('T')[0];
  let statut = 1;
  console.log("data",data);
  let queryString = 'INSERT INTO `contrats` (`id_contrat`, `id_type_contrat`, `id_client`, `adresse_facturation`, `niveau_service`, `datedebut`, `duree`, `actif`, `tarifassurance`, `mensualite_ht`, `date_ajout`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  let inserts = [null,data['id_type_contrat'],data['id_client'],data['adresse_facturation'],data['niveau_service'],data['datedebut'],data['duree'],1,data['tarifassurance'],data['mensualite_ht'],timeString];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//update contrat
app.put('/contrats',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `contrats` SET `id_type_contrat` = ?, `id_client` = ?, `adresse_facturation` = ?, `niveau_service` = ?, `datedebut` = ?, `duree` = ?, `tarifassurance` = ?, `mensualite_ht` = ? WHERE `contrats`.`id_contrat` =?;'
  let inserts = [data['id_type_contrat'],data['id_client'],data['adresse_facturation'],data['niveau_service'],data['datedebut'],data['duree'],data['tarifassurance'],data['mensualite_ht'],data['id_contrat']];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.get('/types_contrats', function (req, res) {
  queryDB(res,'select * from types_contrats');
})
//get contrats to associer
app.get('/contrats/associer', function (req, res) {
  queryDB(res,"SELECT `contrats`.`id_contrat`, `clients`.`societe` FROM `contrats`, `clients` WHERE `contrats`.`id_client` = `clients`.`id_client`;");
})
//data base : users
//get user data
app.get('/utilisateurs', function (req, res) {
  queryDB(res,'SELECT * FROM `users`');
})
//get user profil
app.get('/utilisateurs/email=:email', function (req, res) {
  console.log("get user profil by email",req.params);
  let queryString = 'SELECT `profil` FROM `users` WHERE `email`= ?';
  let inserts = [req.params["email"]];
  queryString = mysqlFunction.format(queryString, inserts);
  queryDB(res,queryString);
  //res.end();
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
  let inserts = [data["nom"],data["prenom"],data["societe"],data["username"],data["motdepasse"],data["email"],data["tel"],data["profil"],data["id_user"]];
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
//clients
app.get('/clients', function (req, res) {
  queryDB(res,'SELECT * FROM `clients`');
})
//add new clients
app.post('/clients', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'CALL `new_client`(?,?,?,?,?,?,?,?,?);';
  let inserts = [data["societe"],data["siret"],data["referent"],data["adresse"],data["cp"],data["ville"],data["email"],data["telfixe"],data["portable"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/clients', jsonParser, function(req,res){
  let data = req.body;
  console.log("data",data);
  let queryString = 'CALL `update_client`(?,?,?,?,?,?,?,?,?,?);';
  let inserts = [data["societe"],data["siret"],data["referent"],data["adresse"],data["cp"],data["ville"],data["email"],data["telfixe"],data["portable"],data['id_client']];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//batteries
app.get('/batteries', function (req, res) {
  queryDB(res,'SELECT * FROM `batteries`');
})
app.post('/batteries', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'INSERT INTO `batteries` (`id_batterie`, `date_production`, `date_achat`, `poids`, `puissance`, `bms`, `identifiant_bms`, `identifiant`, `cellule`, `nb_cycles`, `statut`, `date_ajout`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  let inserts = [null, data["date_production"],data["date_achat"], data["poids"], data["puissance"],data["bms"], data["identifiant_bms"], data["identifiant"], data["cellule"], data["nb_cycles"], data["statut"], data["date_ajout"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/batteries', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'UPDATE `batteries` SET `date_production` = ?, `date_achat` = ?, `poids` = ?, `puissance` = ?, `bms` = ?, `identifiant_bms` = ?, `identifiant` = ?, `cellule` = ?, `nb_cycles` = ?, `statut` = ?, `date_ajout` = ? WHERE `batteries`.`id_batterie` = ?;';
  let inserts = [data["date_production"],data["date_achat"], data["poids"], data["puissance"],data["bms"], data["identifiant_bms"], data["identifiant"], data["cellule"], data["nb_cycles"], data["statut"], data["date_ajout"], data['id_batterie']];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/batteries/contrat', jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let contrat = data['contratModalType']===1?data['id_contrat']:null;
  let queryString = 'UPDATE `batteries` SET `id_contrat` = ? WHERE `batteries`.`id_batterie` = ?';
  let inserts = [contrat,data["id_batterie"]];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/batteries/statut', jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `batteries` SET `statut` = ? WHERE `batteries`.`id_batterie` = ?';
  let inserts = [data['statut'],data["id_batterie"]];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//chargeurs
app.get('/chargeurs', function (req, res) {
  queryDB(res,'SELECT * FROM `chargeurs`');
})
//add new chargeur
app.post('/chargeurs', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'INSERT INTO `chargeurs` (`id_chargeur`, `id_client`, `identifiant`, `statut`, `date_production`, `date_acquisition`, `date_ajout`) VALUES (?, ?, ?, ?, ?, ?, ?);';
  let inserts = [null, null, data["identifiant"], data["statut"], data["date_production"],data["date_acquisition"], data["date_ajout"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//modifier  chargeur
app.put('/chargeurs', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'UPDATE `chargeurs` SET `identifiant` = ?, `statut` = ?, `date_production` = ?, `date_acquisition` = ?, `date_ajout`  = ? WHERE `chargeurs`.`id_chargeur` = ?;';
  let inserts = [data["identifiant"],data["statut"], data["date_production"], data["date_acquisition"],data["date_ajout"], data["id_chargeur"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/chargeurs/contrat', jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let contrat = data['contratModalType']===1?data['id_contrat']:null;
  let queryString = 'UPDATE `chargeurs` SET `id_contrat` = ? WHERE `chargeurs`.`id_chargeur` = ?';
  let inserts = [contrat,data["id_chargeur"]];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/chargeurs/statut', jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `chargeurs` SET `statut` = ? WHERE `chargeurs`.`id_chargeur` = ?';
  let inserts = [data['statut'],data["id_chargeur"]];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
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
app.get('/scooters/associer', function (req, res) {
  queryDB(res,"SELECT `id_scooter` FROM `scooters` WHERE `id_contrat` IS NULL OR `id_scooter` = ''");
})
app.put('/scooters',jsonParser, function (req, res) {
  let data = req.body;
  let timeString = new Date().toJSON().split('T')[0];
  console.log("data",data);
  let queryString = 'UPDATE `scooters` SET `num_cruisrent` = ? , `marque` = ?, `modele` = ?, `immat` = ?, `date_immat` = ?, `type_usage` = ?, `composants` = ?, `num_chassis` = ?, `nb_kms` = ?, `controle_qualite` = ?, `num_contratassurance` = ?, `assureur` = ?, `debut_assurance` = ?, `duree_assurance` = ?, `statut` = ? WHERE `scooters`.`id_scooter` = ?';
  let inserts =[data["num_cruisrent"],data["marque"],data["modele"],
    data["immat"],data["date_immat"],data["type_usage"],data["composants"],data["num_chassis"],
    data["nb_kms"],data["controle_qualite"],data["num_contratassurance"],data["assureur"],
    data["debut_assurance"],data["duree_assurance"],data["statut"],data['id_scooter']];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/scooters/boitier',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString1, queryString2, inserts1, inserts2;
  if (data['boitierModalType']===1) {
    queryString1 = 'UPDATE `scooters` SET `id_boitier` = ?, `actif` = ? WHERE `scooters`.`id_scooter` = ?;';
    inserts1 = [data['id_boitier'],1,data["id_scooter"]];
    let date_mis_en_place = new Date().toJSON().split('T')[0];
    queryString2 = 'UPDATE `boitiers` SET `id_scooter` = ?, `date_mis_en_place` = ? WHERE `boitiers`.`id_boitier` = ?;';
    inserts2 = [data["id_scooter"],date_mis_en_place, data['id_boitier']];
  }else {
    queryString1 = 'UPDATE `scooters` SET `id_boitier` = ?, `actif` = ? WHERE `scooters`.`id_scooter` = ?;';
    inserts1 = [null,0,data["id_scooter"]];
    queryString2 = 'UPDATE `boitiers` SET `id_scooter` = ? WHERE `boitiers`.`id_boitier` = ?;';
    inserts2 = [null, data['id_boitier']];
  }
  queryString = mysqlFunction.format(queryString1,inserts1).concat(mysqlFunction.format(queryString2,inserts2));
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/scooters/contrat',jsonParser, function (req, res) {
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

//statuts
app.get('/statuts', function (req, res) {
  queryDB(res,'SELECT * FROM `statuts`');
})
//statuts_cles
app.get('/statuts_cles', function (req, res) {
  queryDB(res,'SELECT * FROM `statuts_cles`');
})
//auth
app.get('/users', function (req, res) {
  queryDB(res,'SELECT * FROM `users`');
})
//Boitier
//get boitiers
app.get('/boitiers', function (req, res) {
  queryDB(res,'SELECT * FROM `boitiers`');
})
app.get('/boitiers/associer', function (req, res) {
  queryDB(res,"SELECT `id_boitier`,`imei` FROM `boitiers` WHERE `id_scooter` IS NULL OR `id_scooter` = ''");
})
//add new boitier
app.post('/boitiers', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'INSERT INTO `boitiers` (`id_boitier`, `date_acquisition`, `date_reception`, `identifiant`, `date_mis_en_place`, `num_tel`, `code_puk`, `imei`, `password`, `code_pin`, `forfait`, `date_activation`, `statut`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  let inserts = [null, data["date_acquisition"], data["date_reception"], data["identifiant"], null, data["num_tel"], data["code_puk"], data["imei"], data["password"],data["code_pin"], data["forfait"],data["date_activation"], data["statut"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/boitiers', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'UPDATE `boitiers` SET `date_acquisition` = ?, `date_reception` = ?, `identifiant` = ?, `num_tel` = ?, `code_puk` = ?, `imei` = ?, `password` = ?, `code_pin` = ?, `forfait` = ?, `date_activation` = ?, `statut` = ? WHERE `boitiers`.`id_boitier` = ?;';
  let inserts = [data["date_acquisition"], data["date_reception"], data["identifiant"],data["num_tel"], data["code_puk"], data["imei"], data["password"],data["code_pin"], data["forfait"],data["date_activation"], data["statut"], data['id_boitier']];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/boitiers/scooter', jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString1;
  let queryString2;
  let inserts1;
  let inserts2;
  if(data['scooterModalType']===1){
    let date_mis_en_place = new Date().toJSON().split('T')[0];
    queryString1 = 'UPDATE `boitiers` SET `id_scooter` = ?, `date_mis_en_place` = ? WHERE `boitiers`.`id_boitier` = ?;'
    queryString2 = 'UPDATE `scooters` SET `id_boitier` = ? WHERE `scooters`.`id_scooter` = ?;';
    inserts1 = [data["id_scooter"], date_mis_en_place, data['id_boitier']];
    inserts2 = [data['id_boitier'], data["id_scooter"]];
  }else {
    queryString1 = 'UPDATE `boitiers` SET `id_scooter` = ? WHERE `boitiers`.`id_boitier` = ?;';
    queryString2 = 'UPDATE `scooters` SET `id_boitier` = ? WHERE `scooters`.`id_scooter` = ?;';
    inserts1 = [null, data['id_boitier']];
    inserts2 = [null, data["id_scooter"]];
  }
  queryString = mysqlFunction.format(queryString1,inserts1).concat(mysqlFunction.format(queryString2,inserts2));
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//Facturations
app.get('/facturations', function (req, res) {
  console.log("factures",req.query);
  if(Object.getOwnPropertyNames(req.query).length>0){
    let queryString = 'SELECT * FROM `factures`, `clients` WHERE `factures`.`id_client`=`clients`.`id_client` AND `factures`.`id_facture`= ?';
    let inserts = [req.query['id']];
    queryString = mysqlFunction.format(queryString,inserts);
    console.log("queryString",queryString);
    queryDB(res,queryString);
  }else {
    queryDB(res,'SELECT * FROM `factures`, `clients` WHERE `factures`.`id_client`=`clients`.`id_client`');
  }
})
app.get('/facturations/num_facture', function (req, res) {
  console.log("factures num_facture");
  queryDB(res,'CALL `num_facture`(@p0); SELECT @p0 AS `num_facture`;');
})
app.post('/facturations', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'CALL `new_facturation`(?,?,?,?);';
  let inserts = [data["num_facture"], data["id_client"],data["designation"], data["date_facture"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/facturations', jsonParser, function (req, res) {
  let data = req.body;
  let queryString = 'CALL `update_facturation`(?,?,?,?,?,?);'
  let inserts = [data["num_facture"], data["designation"],data["totalht"], data["tva"],data["date_facture"], data["id_facture"]];
  queryString = mysqlFunction.format(queryString,inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//alerte
app.get('/alertes', function (req, res) {
  queryDB(res,'SELECT * FROM `alertes`,`types_alertes` WHERE `alertes`.`id_type_alerte` = `types_alertes`.`id_type_alerte`');
})
app.post('/alertes',jsonParser , function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'INSERT INTO `alertes` (`id_type_alerte`, `id_group`) VALUES (?,?);'
  let inserts = [data['id_type_alerte'],data['id_group']];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/alertes',jsonParser , function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `alertes` SET `id_type_alerte` = ?, `id_group` = ? WHERE `alertes`.`id_alerte` =?;'
  let inserts = [data['id_type_alerte'],data['id_group'],data['id_alerte']];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//type_alerte
app.get('/types_alertes', function (req, res) {
  queryDB(res,'SELECT * FROM `types_alertes`');
})
app.post('/types_alertes',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'INSERT INTO `types_alertes` (`nom`, `parameter1`, `parameter2`) VALUES (?,?,?);'
  let inserts = [data['nom'],data['parameter1'],data['parameter2']];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
app.put('/types_alertes',jsonParser, function (req, res) {
  let data = req.body;
  console.log("data",data);
  let queryString = 'UPDATE `types_alertes` SET `nom` = ?, `parameter1` = ?, `parameter2` = ? WHERE `types_alertes`.`id_type_alerte` =?;'
  let inserts = [data['nom'],data['parameter1'],data['parameter2'],data['id_type_alerte']];
  queryString = mysqlFunction.format(queryString, inserts);
  console.log("queryString",queryString);
  queryDB(res,queryString);
})
//test
app.get('/contrats/name=:name&&id=:id', function (req, res) {
  console.log("get contrats by name",req.params);
  res.end();
})
var server = app.listen(process.env.PORT||8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at localhost", host, port)

})
