const util        = require('util');
const InputEvent  = require('./');

const KEY_STATUS = {
  KEY_UP    : 0x00,
  KEY_PRESS : 0x01,
  KEY_DOWN  : 0x02
};
/**
 * [Keyboard description]
 * @param {[type]} device [description]
 */
function Keyboard(device){
  var self = this;
  InputEvent.apply(this, arguments);
  this.on('data', function(ev){
    // filting key event
    if(InputEvent.EVENT_TYPES.EV_KEY == ev.type){
      switch(ev.value){
        case KEY_STATUS.KEY_UP:
          self.emit('keyup', ev);
          break;
        case KEY_STATUS.KEY_DOWN:
          self.emit('keydown', ev);
          break;
        case KEY_STATUS.KEY_PRESS:
          self.emit('keypress', ev);
          break;
      }
    }
  });
};
/**
 * [inherits description]
 * @param  {[type]} Keyboard   [description]
 * @param  {[type]} InputEvent [description]
 * @return {[type]}            [description]
 */
util.inherits(Keyboard, InputEvent);
/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Keyboard;
