const util        = require('util');
const InputEvent  = require('./');

const ROTARY_STATUS = {
  ROTARY_LEFT  :  1,
  ROTARY_RIGHT : -1
};
/**
 * [Rotary description]
 * @param {[type]} device [description]
 */
function Rotary(device){
  var self = this;
  InputEvent.apply(this, arguments);
  this.on('data', function(ev){
    // filting rotary event
    if(InputEvent.EVENT_TYPES.EV_REL == ev.type){
      switch(ev.value){
        case ROTARY_STATUS.ROTARY_LEFT:
          self.emit('left', ev);
          break;
        case ROTARY_STATUS.ROTARY_RIGHT:
          self.emit('right', ev);
          break;
      }
    }
  });
};
/**
 * [inherits description]
 * @param  {[type]} Rotary     [description]
 * @param  {[type]} InputEvent [description]
 * @return {[type]}            [description]
 */
util.inherits(Rotary, InputEvent);
/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Rotary;
