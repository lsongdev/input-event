const fs            = require('fs');
const util          = require('util');
const EventEmitter  = require('events');
/**
 * InputEvent
 */
function InputEvent(device, options){
  EventEmitter.call(this);
  options = { flags: 'r', encoding: null };
  this.device  = device;
  this.options = options;
  this.fd = fs.createReadStream(device, options);
  this.fd.on('data', this.process.bind(this));
}
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

InputEvent.prototype.process = function(data){
  var ev = this.parse(data);
  this.emit('data', ev);
};

util.inherits(InputEvent, EventEmitter);
/**
 * [exports InputEvent]
 * @type {[type]}
 */
module.exports = InputEvent;
