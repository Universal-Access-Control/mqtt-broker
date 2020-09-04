require('dotenv-defaults/config');
const mongoose = require('mongoose');
const to = require('await-to-js').default;
const broker = require('./broker');

const server = require('net').createServer(broker.handle)
const port = process.env.MQTT_PORT;

(async () => {
  const dbUrl = process.env.MONGODB_URL;
  const dbName = process.env.DB_NAME;
  const dbOptions = { dbName, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true};

  const [err] = await to(mongoose.connect(dbUrl, dbOptions));
  if (err) {
    console.log('Database connection error: ', err);
    process.exit(1);
  }

  // Remove all devices from list of active devices
  await to(ActiveDeviceModel.deleteMany({}).exec());

  server.listen(port, '0.0.0.0', function () {
    console.log('🚀  Server listening on port: ', port)
  });
})();
