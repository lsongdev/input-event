const util       = require('util');
const InputEvent = require('./');
const Keyboard   = require('./keyboard');
/**
 * [AXES description]
 * @type {Object}
 */
const AXES = {
  REL_X     : 0x00,
  REL_Y     : 0x01,
  REL_Z     : 0x02,
  REL_RX    : 0x03,
  REL_RY    : 0x04,
  REL_RZ    : 0x05,
  REL_HWHEEL: 0x06,
  REL_DIAL  : 0x07,
  REL_WHEEL : 0x08,
  REL_MISC  : 0x09
};
/**
 * [Mouse description]
 * @param {[type]} device [description]
 */
function Mouse(device){
  var self = this;
  Keyboard.apply(this, arguments);
  this.on('data', function(ev){
    if(InputEvent.EVENT_TYPES.EV_REL == ev.type){
      // @docs: https://www.kernel.org/doc/Documentation/input/joystick-api.txt
      switch(ev.code || ev.number){ // joystick define ev.number means axis/button number
        case AXES.REL_X:
        case AXES.REL_Y:
        case AXES.REL_Z:
        case AXES.REL_RX:
        case AXES.REL_RY:
        case AXES.REL_RZ:
          this.emit('move', ev);
          break;
        case AXES.REL_WHEEL:
        case AXES.REL_HWHEEL:
          this.emit('wheel', ev);
          break;
      }
    }
  });
};
/**
 * [inherits description]
 * @param  {[type]} Mouse    [description]
 * @param  {[type]} Keyboard [description]
 * @return {[type]}          [description]
 */
util.inherits(Mouse, Keyboard);
/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Mouse;
