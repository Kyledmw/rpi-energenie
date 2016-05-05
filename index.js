function Energenie() {
    
    var OUT = "output";
    
    var GPIO = require('pi-gpio');
    var async = require('async');
    var sleep = require('sleep');
    
    // The GPIO pins for the Energenie module
    var BIT1 = 11;
    var BIT2 = 15;
    var BIT3 = 16;
    var BIT4 = 13;
    
    var ON_OFF_KEY = 24;
    var ENABLE = 25;
    
    // Codes for switching on and off the sockets
    //         all     1       2       3       4
    var ON = ['1011', '1111', '1110', '1101', '1100'];
    var OFF = ['0011', '0111', '0110', '0101', '0100'];
    
    function write(callback) {
        async.parallel([ 
            function(innerCallback) {
                GPIO.write(ON_OFF_KEY, 0, innerCallback);
            },
            function(innerCallback) {
                GPIO.write(ENABLE, 0, innerCallback);
            },
            function(innerCallback) {
                GPIO.write(BIT1, 0, innerCallback);
            },
            function(innerCallback) {
                GPIO.write(BIT2, 0, innerCallback);
            },
            function(innerCallback) {
                GPIO.write(BIT3, 0, innerCallback);
            },
            function(innerCallback) {
                GPIO.write(BIT4, 0, innerCallback);
            },
        ], 
        function (err, res) {
            callback(err, res);
        });
    }
    
    
    function init(callback) {
        async.parallel([
            function(innerCallback) {
                GPIO.open(BIT1, OUT, innerCallback);
            },
            function(innerCallback) {
                GPIO.open(BIT2, OUT, innerCallback);
            },
            function(innerCallback) {
                GPIO.open(BIT3, OUT, innerCallback);
            },
            function(innerCallback) {
                GPIO.open(BIT4, OUT, innerCallback);
            },
            function(innerCallback) {
                GPIO.open(ON_OFF_KEY, OUT, innerCallback);
            },
            function(innerCallback) {
                GPIO.open(ENABLE, OUT, innerCallback);
            },
        ], function(err, res) {
            write(callback);
        });
    }
    
    function changePlugState(socket, onOrOff, callback) {
        async.parallel([ 
            function(innerCallback) {
                var state = onOrOff[socket].charAt(3) == '1';
                GPIO.write(BIT1, state, innerCallback);
            },
            function(innerCallback) {
                var state = onOrOff[socket].charAt(2) == '1';
                GPIO.write(BIT2, state, innerCallback);
            },
            function(innerCallback) {
                var state = onOrOff[socket].charAt(1) == '1';
                GPIO.write(BIT3, 0, innerCallback);
            },
            function(innerCallback) {
                var state = onOrOff[socket].charAt(0) == '1';
                GPIO.write(BIT4, 0, innerCallback);
            },
        ], 
        function (err, res) {
            sleep.usleep(100000);
            GPIO.write(ENABLE, 1, function(err) {
                sleep.usleep(250000);
                GPIO.write(ENABLE, 0, function(err) {
                    callback(err);
                });
            });
        });
    }
    
    function switchOn(socket, callback) {
        changePlugState(socket, ON, callback);
    }
    
    function switchOff(socket, callback) {
        changePlugState(socket, OFF, callback);
    }
    
    this.init = init;
    this.switchOn = switchOn;
    this.switchOff = switchOff;
}

module.exports = new Energenie();