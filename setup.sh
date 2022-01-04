# usage:
# > sudo setup.sh
# --- or --- 
# > /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

if [ "$HOSTNAME" != raspberrypi ]; then
  echo "ras-lights should only be installed on a raspberry pi"
  exit
fi

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

echo "[ras-lights setup.sh] Installing dependencies" 
apt-get update
apt-get install nginx -y
apt-get install supervisor -y
# node may already be installed...
if [[ -z "$(type -p node)" ]]
then 
  apt-get install node -y
fi

NODE_VERSION=$(node --version | perl -pe 's/^v(\d+)\..*/\1/')
if [[ NODE_VERSION -lt 12]]
then 
  echo "[ras-lights setup.sh] Incompatible Node version. Please upgrade to version 12 or higher" 
  exit
fi

# TODO: test if node is installed and has version > 12 
# apt-get install node -y # should already be installed

# clone the repo
cd /home/pi
if [ -d "/home/pi/ras-lights" ] 
then
    echo "[ras-lights setup.sh] Directory /home/pi/ras-lights" 
else
    echo "[ras-lights setup.sh] cloning ras lights repo"
    git clone https://github.com/jdthorpe/ras-lights
fi

cd /home/pi/ras-lights
echo "[ras-lights setup.sh] Configuring NGINX"
cp nginx.conf /etc/nginx/nginx.conf
echo "[ras-lights setup.sh] Configuring supervisord"
cp supervisor.conf /etc/supervisor/confi.d/supervisor.conf

echo "[ras-lights setup.sh] install api dependencies"
pushd api
npm install
popd

echo "[ras-lights setup.sh] install common dependencies"
pushd common
npm install
popd

echo "[ras-lights setup.sh] starting the application"
supervisorctl reload
