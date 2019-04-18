#!/bin/bash

npm install > /dev/null 2>&1 & # npm install in this directory
cd client/
npm install > /dev/null 2>&1 & # npm install in the client directory
echo Waiting for npm install to finish
wait # waits for the npm install commands to finish

npm start > /dev/null 2>&1 & # starts the frontend
cd ..
npm start > /dev/null 2>&1 & # starts the backend
echo Waiting 60 seconds for the webpage to turn on
sleep 60s

echo Running the Cypress tests
node_modules/.bin/cypress run # runs the actual tests

kill %1 > /dev/null 2>&1 # kills the database
kill %2 > /dev/null 2>&1 # kills the webpage
