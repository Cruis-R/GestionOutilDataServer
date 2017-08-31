# GestionOutilDataServer  
## Install database and configuration  
If you are familiar with LAMP stack, you can skip this part.  
install apache2  
```
sudo apt-get update
sudo apt-get install apache2
```

install phpMyAdmin  
```
sudo apt-get update
sudo apt-get install phpmyadmin php-mbstring php-gettext
sudo phpenmod mcrypt
sudo phpenmod mbstring
sudo systemctl restart apache2
```

install MySQL
```
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
systemctl status mysql.service
```
## Import data
Import SQL file  
```
$ mysql
mysql > create database <database name>
mysql > exit
$ sudo mysql -u <user name> -p<password> <database name> < sqlfilename.sql  
```
## Server Connection Congiguration
Open file **server.js** and change the host, user, password and database  
```
var getConnection = function(){
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Xiao7Xiao8',
    database: 'cruisrgestion',
    multipleStatements: true
  });
}
```

## Run server before you run web application  
Use the server  
```
npm install  
node server.js
```

# Server Stack
express nodejs  
