# GestionOutilDataServer  
install nvm  
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
nvm use node
```
install apache2  
```
sudo apt-get update
sudo apt-get install apache2
```

install MySQL
```
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
systemctl status mysql.service
```

Import SQL file  
```
mysql -u <user name> -p<password> <database name> < sqlfilename.sql  
```

install phpMyAdmin  
```
sudo apt-get update
sudo apt-get install phpmyadmin php-mbstring php-gettext
sudo phpenmod mcrypt
sudo phpenmod mbstring
sudo systemctl restart apache2
```
Use the server  
```
npm install  
node server.js
```

# Server Stack
express nodejs  
