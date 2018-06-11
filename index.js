const InputEvent    = require('./lib');
/**
 * [devices]
 */
InputEvent.Mouse    = require('./lib/mouse');
InputEvent.Keyboard = require('./lib/keyboard');
InputEvent.JoyStick = require('./lib/joystick');
InputEvent.Rotary   = require('./lib/rotary');
/**
 * [exports InputEvent]
 * @type {[type]}
 */
module.exports = InputEvent;
