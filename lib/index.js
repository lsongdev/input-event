const fs     = require('fs');
const util   = require('util');
const events = require('events');
const os     = require('os');
const psize  = os.arch().indexOf('64')==-1 ? 16 : 24;

/**
 * [EVENT_TYPES]
 * @type {Object}
 * @docs https://www.kernel.org/doc/Documentation/input/event-codes.txt
 * @docs https://www.kernel.org/doc/Documentation/input/joystick-api.txt
 * @source /include/uapi/linux/input-event-codes.h
 */
const EVENT_TYPES = {
  EV_SYN      : 0x00,
  EV_KEY      : 0x01, // [joystick] JS_EVENT_BUTTON
  EV_REL      : 0x02, // [joystick] JS_EVENT_AXIS
  EV_ABS      : 0x03,
  EV_MSC      : 0x04,
  EV_SW       : 0x05,
  EV_LED      : 0x11,
  EV_SND      : 0x12,
  EV_REP      : 0x14,
  EV_FF       : 0x15,
  EV_PWR      : 0x16,
  EV_FF_STATUS: 0x17,
  EV_MAX      : 0x1f,
  EV_INIT     : 0x80 // [joystick] JS_EVENT_INIT
};
/**
 * InputEvent
 */
function InputEvent(device, options){
  
  events.EventEmitter.call(this);
  
  this.device  = (device instanceof InputEvent) ? device.device : device;
  this.options = options || { flags: 'r', encoding: null };
  this.fd = fs.createReadStream(this.device, this.options);
  
  this.fd.on('data', function(data){
    for(var offset=0; offset<data.length-psize; offset+=psize){
      var chunk = data.slice(offset,offset+psize);
      
      this.emit('raw', chunk);
      var ev = this.parse(chunk);
      if(ev) this.emit('data', ev, chunk);
    }
  }.bind(this));
}
/**
 * [inherits EventEmitter]
 */
util.inherits(InputEvent, events.EventEmitter);
/**
 * [function parse]
 */
InputEvent.prototype.parse = function(buf){
  if(psize==24){
    // source: own research on a 64 bit system
    //struct input_event {
    //  struct{
    //    uint64 sec;
    //    uint64 msec;
    //  }time;
    //  uint16 type;
    //  uint16 code;
    //  uint32 value;
    // };
    return {
      tssec:    buf.readUIntLE(0,8),
      tsusec:   buf.readUIntLE(8,8),
      type:     buf.readUIntLE(16,2),
      code:     buf.readUIntLE(18,2),
      value:    buf.readUIntLE(20,4)
    };
  }else if(psize==16){
    // https://www.kernel.org/doc/Documentation/input/input.txt
    // struct input_event {
    // 	struct timeval time;
    // 	unsigned short type;
    // 	unsigned short code;
    // 	unsigned int value;
    // };
    return {
      tssec:   buf.readUInt32LE(0),
      tsusec:  buf.readUInt32LE(4),
      type:    buf.readUInt16LE(8),
      code:    buf.readUInt16LE(10),
      value:   buf.readUInt32LE(12)
    };
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
 * [EVENT_TYPES]
 */
InputEvent.EVENT_TYPES = EVENT_TYPES;
/**
 * [exports InputEvent]
 * @type {[type]}
 */
module.exports = exports = InputEvent;
