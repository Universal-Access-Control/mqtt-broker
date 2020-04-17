require('dotenv-defaults/config');
const mongoose = require('mongoose');
const to = require('await-to-js').default;
const broker = require('./broker');

const server = require('net').createServer(broker.handle)
const port = process.env.MQTT_PORT;

(async () => {
  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
  const dbUrl = process.env.MONGODB_URL;

  console.log('dbUrl :', dbUrl);
  const [err] = await to(mongoose.connect(dbUrl, dbOptions));
  if (err) {
    console.log('Database connection error: ', err);
    process.exit(1);
  }

  server.listen(port, function () {
    console.log('🚀  Server listening on port: ', port)
  });
})();
