#!/bin/bash

npm install > /dev/null 2>&1 & # npm install in this directory
cd client/
npm install > /dev/null 2>&1 & # npm install in the client directory
cd ..
echo Waiting for npm install to finish
wait # waits for the npm install commands to finish

npm start > /dev/null 2>&1 & # starts the database
cd client/
npm start > /dev/null 2>&1 & # starts the webpage
cd ..
echo Waiting 45 seconds for the webpage to turn on
sleep 45s

echo Running the Cypress tests
node_modules/.bin/cypress run # runs the actual tests

sleep 45s
kill %1 > /dev/null 2>&1 # kills the database
kill %2 > /dev/null 2>&1 # kills the webpage
