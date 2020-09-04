const mongoose = require('mongoose');

const connectedDeviceSchema = mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  connectedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = ActiveDeviceModel = mongoose.model('ConnectedDevice', connectedDeviceSchema);
