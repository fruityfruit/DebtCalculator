# DebtCalculator

## Our app is live!

To use the live version of our app, head to https://debt-calculator-csce-490.appspot.com/.

## Getting Started with a Development Environment

### Prerequisites

You will need: MongoDB, Express.js, Angular, Node.js

### Installation

Follow these steps to install Node.js

https://nodejs.org/en/

Follow these steps to install Express

https://expressjs.com/en/starter/installing.html

Follow these steps to install MongoDB

https://docs.mongodb.com/manual/administration/install-community/

Follow these steps to install Angular and the Angular CLI

https://angular.io/guide/quickstart

## Running our project

First, make sure that MongoDB is running on your computer.

Then, clone this repository.

Then, in a terminal window, navigate to the directory of your clone of our project, named "DebtCalculator".

Next, navigate to the directory "mean-app" and run:
```
npm install
```
Once this has finished, run the following to start the express server:
```
npm start
```
Now, in a separate terminal window, navigate to the directory "mean-app/client" and run:
```
npm install
```
Once this has finished, run the following to start an Angular dev server:
```
npm start
```
Now you can go to http://localhost:4200/ to see it in action!

## Testing our project

We are using the following testing frameworks:

### Behavioral testing with Cypress

To run our behavioral tests, navigate to the "mean-app" directory of our project in a new terminal window and type:
```
./cypress_script.sh
```

### Backend unit testing with Mocha

To run our backend unit tests, navigate to the "mean-app" directory of our project in a terminal window and type:
```
npm install
```
Then
```
npm test
```

### Frontend unit testing with Karma and Jasmine

To run our frontend tests, navigate to the "mean-app/client" directory of our project in a terminal window and type:
```
npm install
```
Then
```
npm test
```

### Automatic testing with Travis

Our frontend and backend unit tests are run automatically on each commit by Travis.

## Deploying our project

To deploy our project on Google Cloud Platform, we opened a Cloud Shell session, cloned our repo, ran the following commands in the mean-app/client directory:
```
npm install
```
```
npm run buildProd
```
```
cp -r dist/ ..
```
Then, in the mean-app directory, we ran:
```
npm install
```
```
export NODE_ENV='production'
```
```
gcloud app deploy
```
When our app is live, it can be seen in production at https://debt-calculator-csce-490.appspot.com/.

## Style Guide

We will be using the Google JavaScript style guide.

(https://google.github.io/styleguide/jsguide.html)

## Acknowledgements

This tutorial created the skeleton of the site.

(https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli)

This github example helped us understand how to create log-in capabilities.

(https://github.com/sitepoint-editors/MEAN-stack-authentication)
