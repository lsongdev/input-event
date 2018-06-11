const InputEvent = require('../');

const input = new InputEvent('/dev/input/event0');
//const input = new InputEvent('/dev/input/mice');
//
// input.on('data', function(buffer){
//   console.log(buffer);
// });

// const keyboard = new InputEvent.Keyboard(input);
// keyboard.on('data'    , console.log);
// keyboard.on('keyup'   , console.log);
// keyboard.on('keydown' , console.log);
// keyboard.on('keypress', console.log);

//const mouse = new InputEvent.Mouse(input);
// mouse.on('data'    , console.log);
// mouse.on('move'    , console.log);
// mouse.on('wheel'   , console.log);
// mouse.on('keyup'   , console.log);
// mouse.on('keydown' , console.log);
//mouse.on('keypress', console.log);

// const joystick = new InputEvent.JoyStick(input);
// joystick.on('data'    , console.log);
// joystick.on('move'    , console.log);
// joystick.on('keyup'   , console.log);
// joystick.on('keydown' , console.log);
// joystick.on('keypress', console.log);

const rotary = new InputEvent.Rotary(input);
rotary.on('left'  , ev => console.log('left',  ev));
rotary.on('right' , ev => console.log('right', ev));
