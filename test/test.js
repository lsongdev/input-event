var InputEvent = require('../');

var input = new InputEvent('/dev/input/event6');
//var input = new InputEvent('/dev/input/mice');
//
// input.on('data', function(buffer){
//   console.log(buffer);
// });

var keyboard = new InputEvent.Keyboard(input);
// keyboard.on('data'    , console.log);
keyboard.on('keyup'   , console.log);
keyboard.on('keydown' , console.log);
// keyboard.on('keypress', console.log);

//var mouse = new InputEvent.Mouse(input);
// mouse.on('data'    , console.log);
// mouse.on('move'    , console.log);
// mouse.on('wheel'   , console.log);
// mouse.on('keyup'   , console.log);
// mouse.on('keydown' , console.log);
//mouse.on('keypress', console.log);


// var joystick = new InputEvent.JoyStick(input);
// joystick.on('data'    , console.log);
// joystick.on('move'    , console.log);
// joystick.on('keyup'   , console.log);
// joystick.on('keydown' , console.log);
// joystick.on('keypress', console.log);
