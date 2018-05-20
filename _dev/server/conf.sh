## enable proxying in apache
echo "(!) Enabling proxy modules for apache"
sudo a2enmod proxy
sudo a2enmod proxy_http

## create the .conf file and place it into the directory apache will search for
echo "(!) Adding apache.conf to sites-enabled"
MODULE_NAME="Shipping_Proxy";
sudo rm /etc/apache2/sites-enabled/$MODULE_NAME.conf
sudo rm /etc/apache2/sites-available/$MODULE_NAME.conf
sudo ln -s `pwd`/apache.conf /etc/apache2/sites-available/$MODULE_NAME.conf &&
sudo ln -s /etc/apache2/sites-available/$MODULE_NAME.conf /etc/apache2/sites-enabled/$MODULE_NAME.conf
sudo service apache2 restart

## restart apache to apply changes
echo "(!) Restarting apache2";
sudo service apache2 restart;
