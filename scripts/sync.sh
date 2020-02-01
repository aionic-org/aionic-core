#!/bin/sh

# Synchronize with head

git fetch
git checkout master
git pull
rm -rf node_modules
yarn install
