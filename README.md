# DebtCalculator

## Getting Started

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

So far, we are using the following testing frameworks:

### Behavioral testing with Cypress

To run our Behavioral tests, navigate to the "mean-app" directory of our project in a terminal window and type:
```
npm install
```
Then
```
node_modules/.bin/cypress run --spec cypress/integration/behavior_test.js
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

## Deploying our project

To deploy our project on Google Cloud Platform, we opened a Cloud Shell session, cloned our repo, ran:
```
export NODE_ENV='production'
```
And then ran:
```
gcloud app deploy
```
When our app is live, it can be seen in production at https://debt-calculator-csce-490.appspot.com/.

## Developing with Angular

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Style Guide

We will be using the Google JavaScript style guide.

(https://google.github.io/styleguide/jsguide.html)

## Acknowledgements

This tutorial created the skeleton of the site.

(https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli)

This github example helped us understand how to create log-in capabilities.

(https://github.com/sitepoint-editors/MEAN-stack-authentication)
