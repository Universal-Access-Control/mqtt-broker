require('dotenv-defaults/config');
const mongoose = require('mongoose');
const to = require('await-to-js').default;
const broker = require('./broker');

const server = require('net').createServer(broker.handle)
const port = process.env.MQTT_PORT;

(async () => {
  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
  const dbBaseUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB_NAME;

  const [err] = await to(mongoose.connect(`${dbBaseUrl}/${dbName}`, dbOptions));
  if (err) {
    console.log('Database connection error: ', err);
    process.exit(1);
  }

  server.listen(port, function () {
    console.log('🚀  Server listening on port: ', port)
  });
})();
