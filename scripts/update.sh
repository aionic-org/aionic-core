#!/bin/sh

# Pull, install, build

git fetch
git checkout master
git pull
rm -rf node_modules
yarn install
yarn build
