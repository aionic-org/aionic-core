#!/bin/sh

# Synchronize with remote master

git fetch
git checkout master
git pull
rm -rf node_modules
yarn install
