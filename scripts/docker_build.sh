#!/bin/bash

# get the env vars
. ./BUILD_ENV

. ~/.nvm/nvm.sh
nvm install $NODE_VERSION
nvm alias default $NODE_VERSION
nvm use default

npm install

npm run build
