var util = require('util');
var stream = require('stream');
var dgram = require('dgram');
var net = require('net');

util.inherits(Driver,stream);
util.inherits(Device,stream);

function Driver(opts,app) {
  var self = this;

  this._devices = {};
  this._app = app;

  app.on('client::up',function(){
    //self.emit('register', new Device(app));
    self.startListening();
  });

}

Driver.prototype.startListening = function() {
  var self = this;
  var s = dgram.createSocket('udp4');

  s.bind(9131, function() {
    s.addMembership('239.255.250.250');
  });

  s.on('message', function (message, remote) {
    message = message.toString();
    if (message.indexOf('iTachIP2IR') > -1) {
      var uuid = message.match(/UUID=([A-Za-z0-9_]+)/)[1];

      if (!self._devices[uuid]) {
        self._app.log.info('Found iTach IP device', uuid, 'at', remote.address);
        self._devices[uuid] = new Device(self._app, remote.address, uuid);
        self.emit('register', self._devices[uuid]);
      }

    }
  });

};

function Device(app, ip, uuid) {
  var self = this;

  this._ip = ip;
  this._uuid = uuid;
  this._app = app;
  this.writeable = true;
  this.readable = false;
  this.V = 0;
  this.D = 14; // display_text, should be speech
  this.G = 'iTachIR' + uuid.replace('_','');
  this.name = 'iTachIR - ' + uuid;

  var socket = this._socket = net.connect(4998, ip, function() {

      console.log('Connected to iTach');

      socket.on('data', function(data) {
         console.log('Data : ' + data.toString());
         self.emit('data', data.toString());
      });

  });

}

Device.prototype.write = function(d) {
  this._app.log.info('Sending IR', d);
  this._socket.write(d + '\r\n');
};

module.exports = Driver;
