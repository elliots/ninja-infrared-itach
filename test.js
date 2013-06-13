var opts = {};

var d = new (require('index'))(opts, {
    on : function(x,cb){
        setTimeout(cb, 100);
    },
    log: {
        debug: console.log,
        info: console.log,
        warn: console.log,
        error: console.log
    }
});

d.emit = function(channel, value) {
    console.log('Driver.emit', channel, value);
    if (channel == 'register') {
        value.emit = function(channel, value) {
            console.log('Device.emit', channel, value);
        };

        value.write('sendir,1:1,1,39000,1,1,348,172,21,22,21,63,21,63,21,63,21,22,21,63,21,63,21,63,21,63,21,63,21,63,21,22,21,22,21,22,21,22,21,63,21,63,21,63,21,63,21,22,21,22,21,22,21,22,21,22,21,22,21,63,21,22,21,63,21,22,21,63,21,22,21,63,21,1472,347,87,21,780');
    }
};

d.save = function() {
    console.log('Saved opts', opts);
};
