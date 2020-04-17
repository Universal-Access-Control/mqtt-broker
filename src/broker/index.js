const aedes = require('aedes');
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
const to = require('await-to-js').default;
const ActiveDeviceModel = require('../models/active-device');

const broker = aedes({
  persistence: aedesPersistenceMongoDB({
    url: `${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`
  }),
  authenticate(client, username, password, done) {
    let error = null;
    if (username !== process.env.MQTT_USERNAME || password.toString() !== process.env.MQTT_PASSWORD) {
      error = new Error('Invalid Username or Password');
      error.returnCode = 4;
    }

    done(error, !error);
  }
});

broker.on('clientReady', async (client) => {
  const [err, res] = await to(
    ActiveDeviceModel.updateOne(
      { deviceId: client.id },
      { connectedAt: Date.now() },
      { upsert: true, setDefaultsOnInsert: true }
    ).exec()
  );

  if(err) {
    console.log('⚠ ➕  Add Active Device Error :', err);
  }
});

broker.on('clientDisconnect', async (client) => {
  const [err, res] = await to(
    ActiveDeviceModel.deleteOne({ deviceId: client.id }).exec()
  );
  
  if(err) {
    console.log('⚠ ➖  Delete Active Device Error :', err);
  }
});

module.exports = broker;
