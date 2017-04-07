const fs     = require('fs');
const util   = require('util');
const events = require('events');
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
  var self = this;
  events.EventEmitter.call(this);
  this.device  = (device instanceof InputEvent) ? device.device : device;
  this.options = options || { flags: 'r', encoding: null };
  this.fd = fs.createReadStream(this.device, this.options);
  this.fd.on('data', function(data){
    self.emit('raw', data);
    self.process(data);
  });
}
/**
 * [inherits EventEmitter]
 */
util.inherits(InputEvent, events.EventEmitter);

/**
 * [function process]
 */
InputEvent.prototype.process = function(buf){
  var ev;

  /**
   * Sometimes (modern Linux), multiple key events will be in the triggered at once for the same timestamp.
   * The first 4 bytes will be repeated for every event, so we use that knowledge to actually split it.
   * We assume event structures of 3 bytes, 8 bytes, 16 bytes or 24 bytes.
   */
  if (buf.length > 8) {
    var t = buf.readUInt32LE(0);
    var lastPos = 0;
    for (var i = 8, n = buf.length; i < n; i += 8) {
      if (buf.readUInt32LE(i) === t) {
        var part = buf.slice(lastPos, i);
        ev = this.parse(part);
        if(ev) this.emit('data', ev, part);
        lastPos = i;
      }
    }
    var part = buf.slice(lastPos, i);
    ev = this.parse(part);
    if(ev) this.emit('data', ev, part);
  } else {
    ev = this.parse(buf);
    if(ev) this.emit('data', ev, buf);
  }
};

InputEvent.prototype.parse = function(buf){
  if(buf.length >= 24){
    // unsigned long time structure.
    return {
      tssec:   buf.readUInt32LE(0),
      tsusec:  buf.readUInt32LE(8),
      type:    buf.readUInt16LE(16),
      code:    buf.readUInt16LE(18),
      value:   buf.readUInt32LE(20)
    };
  }if(buf.length >= 16){
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
  }else if(buf.length == 8){
    // https://www.kernel.org/doc/Documentation/input/joystick-api.txt
    // struct js_event {
    // 	__u32 time;     /* event timestamp in milliseconds */
    // 	__s16 value;    /* value */
    // 	__u8 type;      /* event type */
    // 	__u8 number;    /* axis/button number */
    // };
    return {
        time  : buf.readUInt32LE(0),
        value : buf.readInt16LE(4),
        type  : buf.readUInt8(6),
        number: buf.readUInt8(7)
    };
  }else if(buf.length == 3){
    // mice mouse
    return {
        t : buf.readInt8(0),
        x : buf.readInt8(1),
        y : buf.readInt8(2)
    };
  }
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
