var energenie = require('rpi-energenie');

energenie.init(function(err) {
   energenie.turnOn(1, function(err) {
       console.log("Turned on 1");
       energenie.turnOn(2, function(err) {
          console.log("Turned on 2"); 
       });
   }) 
});