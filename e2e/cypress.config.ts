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
    setupNodeEvents(on, config) {
      on('task', {
        async connectDB(){
          const client = new Client(config.env.db)
          await client.connect()
          const valid_test_email = config.env.user.TEST_USER_EMAIL;
          const valid_test_password = config.env.user.TEST_USER_PASSWORD;
          
          var algorithm = 'pbkdf2-sha256';
          var iterations = 29000;
          var salt = "WitFCKH03htDKAVA6L3Xmg";
          const hash = crypto.pbkdf2Sync(valid_test_password, salt, iterations, 32, 'sha256');;
          var valid_test_password_hash = `$${algorithm}$${iterations}$${salt}$${hash.toString('base64')}`;
          
          // const valid_test_password_hash = pbkdf2.pbkdf2Sync(valid_test_password, 'sha256')
          // console.log(valid_test_password_hash)
          console.log("valid_test_password_hash");
          console.log(valid_test_password_hash);
          let userId = config.env.user.TEST_USER_ID;
          var query = "UPDATE webapp.users SET email=$1, password_secure=$2 WHERE user_uid=$3";
          var values = [valid_test_email, valid_test_password_hash, userId];
          const res = await client.query(query, values);
          await client.end()
          return "finished updating user"
        }
      });
  },
  },
});

