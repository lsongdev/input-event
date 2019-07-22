const InputEvent = require('.');
const Mouse = require('./mouse');

class JoyStick extends Mouse {
  parse(ev) {
    if (ev.type == InputEvent.EVENT_TYPES.EV_INIT) {
      self.emit('init', ev);
    } else {
      super.parse(ev);
    }
  }
}

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = JoyStick;