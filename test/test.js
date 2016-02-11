var InputEvent = require('../');

var input = new InputEvent('/dev/input/event0');

var keyboard = new InputEvent.Keyboard(input);

keyboard.on('keyup'   , console.log);
keyboard.on('keydown' , console.log);
keyboard.on('keypress', function(ev){
  console.log(ev.code);
});

/*
var mouse = new InputEvent.Mouse(input);

mouse.on('move'    , console.log);
mouse.on('wheel'   , console.log);
mouse.on('keyup'   , console.log);
mouse.on('keydown' , console.log);
mouse.on('keypress', console.log);
*/
