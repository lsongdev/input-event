const fs     = require('fs');
const util   = require('util');
const events = require('events');
/**
 * [EVENT_TYPES]
 * @type {Object}
 * @docs https://www.kernel.org/doc/Documentation/input/event-codes.txt
 */
const EVENT_TYPES = {
  EV_SYN      : 0x00,
  EV_KEY      : 0x01,
  EV_REL      : 0x02,
  EV_ABS      : 0x03,
  EV_MSC      : 0x04,
  EV_SW       : 0x05,
  EV_LED      : 0x06,
  EV_SND      : 0x07,
  EV_REP      : 0x08,
  EV_FF       : 0x09,
  EV_PWR      : 0x10,
  EV_FF_STATUS: 0x11
};

/**
 * InputEvent
 */
function InputEvent(device, options){
  events.EventEmitter.call(this);
  this.device  = device;
  this.options = options || { flags: 'r', encoding: null };
  this.fd = fs.createReadStream(this.device, this.options);
  this.fd.on('data', this.process.bind(this));
}
/**
 * [inherits EventEmitter]
 */
util.inherits(InputEvent, events.EventEmitter);
/**
 * [function parse]
 * @param  {[type]} buf [description]
 * @return {[type]}     [description]
 */
InputEvent.prototype.parse = function(buf){
  return {
    tssec:   buf.readUInt32LE(0),
    tsusec:  buf.readUInt32LE(4),
    type:    buf.readUInt16LE(8),
    code:    buf.readUInt16LE(10),
    value:   buf.readUInt32LE(12)
  };
};
/**
 * [function description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
InputEvent.prototype.process = function(data){
  var ev = this.parse(data);
  this.emit('data', ev);
};

/**
 * [function close]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
InputEvent.prototype.close = function(callback){
  this.fd.close(callback);
};
/**
 * [require description]
 */
InputEvent.EVENT_TYPES = EVENT_TYPES;
InputEvent.Mouse    = require('./mouse');
InputEvent.Keyboard = require('./keyboard');
/**
 * [exports InputEvent]
 * @type {[type]}
 */
module.exports = InputEvent;
