const util        = require('util');
const events      = require('events');
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
  events.EventEmitter.call(this);
  this.device = device;
  this.device.on('data', function(ev){
    if(ev.type == InputEvent.EVENT_TYPES.EV_KEY){
      self.emit(
        ev.status = (Object.keys(KEY_STATUS)[ ev.value ])
          .replace('_', '')
          .toLowerCase()
      , ev);
    }
  });
};
/**
 * [create EventEmitter]
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
util.inherits(Keyboard, events.EventEmitter);

module.exports = Keyboard;
