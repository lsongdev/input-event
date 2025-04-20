const InputEvent = require('.');
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
 * [EV_MOUSE description]
 * @type {Object}
 * @docs http://www.computer-engineering.org/ps2mouse/
 */
const EV_MOUSE = {
  BTN_PRIMARY  : 0x01 << 0, // Usually left
  BTN_SECONDARY: 0x01 << 1, // Usually right
  BTN_TERTIARY : 0x01 << 2, // Usually middle/scroll
  ALWAYS       : 0x01 << 3,
  X_SIGN       : 0x01 << 4,
  Y_SIGN       : 0x01 << 5,
  X_OVERFLOW   : 0x01 << 6,
  Y_OVERFLOW   : 0x01 << 7,
};
const EV_MOUSE_BUTTONS = [
  EV_MOUSE.BTN_PRIMARY,
  EV_MOUSE.BTN_SECONDARY,
  EV_MOUSE.BTN_TERTIARY,
];

class Mouse extends Keyboard {
  constructor(device, options) {
    super(device, options);
    this.mouseButtonStates = 0;
  }

  parse(ev) {
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
        default:
          break;
      }
    }

    // Mice device
    if (Buffer.isBuffer(ev)) {
      // http://stackoverflow.com/questions/15882665/how-to-read-out-scroll-wheel-info-from-dev-input-mice

      // Handle buttons
      for(const button of EV_MOUSE_BUTTONS) {
        if ((ev[0] ^ this.mouseButtonStates) & button) {
          // Button state changed
          this.emit(ev[0] & button ? 'keydown' : 'keyup', { t: button });
          this.mouseButtonStates ^= button;
        }
      }

      // Wheeled movement info
      if ((ev.length >= 4) && ev[3]) {
        this.emit('wheel', {
          time  : 0, // TODO
          number: AXES.REL_WHEEL,
          type  : EV_MOUSE.ALWAYS,
          value : ev[3] - (ev[3] & 128 ? 256 : 0), // Uint -> Sint, embedded sign
        });
      }

      // Regular mouse movement
      if (ev.length >= 3) {
        if (ev[1] || ev[2]) {
          this.emit('move', {
            t: ev[0],
            x: ev[1] - (ev[0] & EV_MOUSE.X_SIGN ? 256 : 0), // Uint -> Sint, external sign
            y: ev[2] - (ev[0] & EV_MOUSE.Y_SIGN ? 256 : 0), // Uint -> Sint, external sign
          });
        }
      }

    }
  }
}

module.exports = Mouse;

// Export useful information for clients
Mouse.BTN_PRIMARY   = EV_MOUSE.BTN_PRIMARY;
Mouse.BTN_SECONDARY = EV_MOUSE.BTN_SECONDARY;
Mouse.BTN_TERTIARY  = EV_MOUSE.BTN_TERTIARY;
