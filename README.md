# SurveyStream Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Running on docker

To deploy the react app on docker, use the following commands

`make image`
`make container-up`


## E2E Testing 

Testing for E2E has been setup using cypress, to setup this locally setup a cypress.env.json file on the root folder. Include the following key values using a valid account email and password for the dev environment.

{
   "TEST_USER_EMAIL":"",
   "TEST_USER_PASSWORD":"",
   "TEST_APP_URL":"http://localhost:3000",
   "TEST_BASE_API_URL":"http://localhost:5001/api",
   "TEST_USER_ID": "19945"
}



To run E2E tests use 

`npm run cypress:run-all`
 
