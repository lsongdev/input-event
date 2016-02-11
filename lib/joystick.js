const util       = require('util');
const InputEvent = require('./');
const Mouse      = require('./mouse');
/**
 * [JoyStick description]
 * @param {[type]} device [description]
 */
function JoyStick(device){
  var self = this;
  Mouse.apply(this, arguments);
  this.on('data', function(ev){
    if(ev.type == InputEvent.EVENT_TYPES.EV_INIT){
      self.emit('init', ev);
    }
  });
};
/**
 * [inherits description]
 * @param  {[type]} JoyStick [description]
 * @param  {[type]} Mouse    [description]
 * @return {[type]}          [description]
 */
util.inherits(JoyStick, Mouse);
/**
 * [exports description]
 * @type {[type]}
 */
module.exports = JoyStick;
