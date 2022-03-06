# usage:
# > sudo setup.sh
# --- or --- 
# > /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jdthorpe/ras-lights/main/setup.sh)"

PURPLE='\035[0;31m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ "$EUID" -ne 0 ]
  then echo -e "Please run as root"
  exit
fi

echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} Installing dependencies" 
apt-get update
apt-get install nginx -y
apt-get install supervisor -y
# node may already be installed...
if [[ -z "$(type -p node)" ]]
then 
  # NO!: apt-get install node -y
  # https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/ 
  wget https://unofficial-builds.nodejs.org/download/release/v12.22.9/node-v12.22.9-linux-armv6l.tar.xz
  tar xfJ node-v12.22.9-linux-armv6l.tar.xz
  sudo cp -R node-v12.22.9-linux-armv6l/* /usr/local
  rm -rf node-v12.22.9-linux-armv6l/
  rm node-v12.22.9-linux-armv6l.tar.xz
fi

NODE_VERSION=$(node --version | perl -pe 's/^v(\d+)\..*/\1/')
if [[ "$NODE_VERSION" -lt "12" ]];
then 
  echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} Incompatible Node version. Please upgrade to version 12 or higher" 
  exit
fi

# TODO: test if node is installed and has version > 12 
# apt-get install node -y # should already be installed

# clone the repo
cd /home/pi
if [ -d "/home/pi/ras-lights" ] 
then
    echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} Directory /home/pi/ras-lights" 
else
    echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} cloning ras lights repo"
    git clone https://github.com/jdthorpe/ras-lights
fi
cd /home/pi/ras-lights

echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} install default-lib dependencies"
pushd default-lib && npm install --only=production && popd

echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} install api dependencies"
pushd api 
# the LED lib needs root perms...
npm install --only=production --unsafe-perm 
node build/__init__.js
popd

echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} Configuring NGINX";
cp nginx.conf /etc/nginx/nginx.conf
nginx -s reload

echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} Configuring supervisord";
cp supervisor.conf /etc/supervisor/conf.d/supervisor.conf
supervisorctl reload

echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} Configuring wifi sleep mode"
if [ -f "/etc/rc.local" ]; then
  if grep -Fq "iwconfig wlan0 power" /etc/rc.local ; then 
    echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${NC} WIFI power already managed in /etc/rc.local"
    echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${RED} See https://raspberrypi.stackexchange.com/a/96608 for options to disable wifi sleep mode -- otherwise you may experience connectivity issues."
  else
    sed -i '/^exit 0/i /sbin/iwconfig wlan0 power off' /etc/rc.local
  fi
else 
    echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${RED} WARNING: no such fil /etc/rc.local; unable to configure WIFI sleep mode${NC}"
    echo -e "${PURPLE}[RAS-LIGHTS setup.sh]${RED} See https://raspberrypi.stackexchange.com/a/96608 for options to disable wifi sleep mode -- otherwise you may experience connectivity issues."
fi
