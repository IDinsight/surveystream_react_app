const { defineConfig } = require('cypress');

const { Client } = require('pg')
const crypto = require('crypto');
// function querytestDB(query: string, config: any) {
//   const connection = postgres.createConnection(config.env.db);

//   connection.connect()

//   return new Promise((resolve, reject) => {
//     connection.query(query, (error: any, results: any) => {
//       if (error) {
//         return reject(error)
//       }

//       connection.end()
//       return resolve(results)
//     });
//   });
// }

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/output.xml',
  },
  env : {
    db: {
      host: "postgres",
      user: "test_user",
      password: "asdf",
      database: "surveystream",
      port: 5433
    },
    //TODO: change this to use config file
    user: {
      TEST_USER_EMAIL:"surveystream.devs@idinsight.org",
      TEST_USER_PASSWORD:"asdfasdf",
      TEST_USER_ID:"19945"
  },
},
  e2e: {
    specPattern: '/cypress/e2e',
    baseUrl: 'http://host.docker.internal:3000', // this works for docker container testing
  
  },
});

