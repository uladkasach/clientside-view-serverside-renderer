MODULE_NAME="clientside-view-serverside-renderer";

BASEDIR=$(dirname "$0");

MODULE_LOCATION=`realpath "$BASEDIR/../node_modules/$MODULE_NAME"`;
MODULE_SOURCE=`realpath "$BASEDIR/../../"`;
MODULE_DESTINATION=`realpath "$BASEDIR/../node_modules"`;
echo $MODULE_LOCATION;
echo $MODULE_SOURCE;
echo $MODULE_DESTINATION;

if [ -e $MODULE_LOCATION ]; then
    echo "(!) module already exists in node modules!"; # dont remove manually because removing sym link can remove whole source directory
fi
ln -s $MODULE_SOURCE $MODULE_DESTINATION;
