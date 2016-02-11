var InputEvent = require('../');

var input = new InputEvent('/dev/input/event0');

input.on('data', function(ev){
  console.log(ev);
});
