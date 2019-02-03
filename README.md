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

Then, navigate to the directory "mean-app" and run:
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

### Behavioral testing with Selenium

To run our behavioral tests, you will need the Selenium IDE, which is a browser extension that can be downloaded here:

https://www.seleniumhq.org/selenium-ide/

Once you have downloaded the IDE, run our project using the instructions listed above.

Then, click on the Selenium IDE browser icon (on Chrome, it will be at the top right corner of your window), which opens a Selenium pop-up window. 

Select "Open an existing project".

Now, navigate to where you have cloned our Github repo, navigate to the "mean-app" folder, then "test", then "selenium", and open any of the files with the extension ".side". Your path should end with "DebtCalculator/mean-app/test/selenium/\*.side".

Press the Play or Play All icons in the top middle of the Selenium screen to run the behavioral test or tests in the file that you have selected.

### Backend unit testing with Mocha

To run our backend unit tests, navigate to the "mean-app" directory in a terminal window and type:
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
