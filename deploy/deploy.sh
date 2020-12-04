#!/bin/bash

echo "\nDeployment starting...\n"
echo "\nCreating build folder...\n"
cd ../frontend
yarn install
yarn run build
echo "\Uploading files...\n"
cd ../deploy
node deploy.js
echo "\nCleaning up...\n"
cd ../app
rm -rf build
echo "\nDeployment complete!\n"