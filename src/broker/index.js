const aedes = require('aedes');
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
const to = require('await-to-js').default;
const ConnectedDeviceModel = require('../models/connected-device');

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
  },
});

broker.on('clientReady', async (client) => {
  console.log('Device connected: ', client.id);
  const [err, res] = await to(
    ConnectedDeviceModel.updateOne(
      { deviceId: client.id },
      { connectedAt: Date.now() },
      { upsert: true, setDefaultsOnInsert: true }
    ).exec()
  );

  if(err) {
    console.log('⚠ Device Activation Error :', err);
  }
});

broker.on('clientDisconnect', async (client) => {
  console.log('Device disconnected: ', client.id);
  const [err, res] = await to(
    ConnectedDeviceModel.deleteOne({ deviceId: client.id }).exec()
  );

  if(err) {
    console.log('⚠ Deactivation Device Error :', err);
  }
});

module.exports = broker;
