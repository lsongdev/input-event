const InputEvent = require('.');

const KEY_STATUS = {
  KEY_UP    : 0x00,
  KEY_PRESS : 0x01,
  KEY_DOWN  : 0x02
};

class Keyboard extends InputEvent {
  parse(ev) {
    // filting key event
    if (InputEvent.EVENT_TYPES.EV_KEY == ev.type) {
      switch (ev.value) {
        case KEY_STATUS.KEY_UP:
          this.emit('keyup', ev);
          break;
        case KEY_STATUS.KEY_DOWN:
          this.emit('keydown', ev);
          break;
        case KEY_STATUS.KEY_PRESS:
          this.emit('keypress', ev);
          break;
      }
    }
  }
}


/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Keyboard;