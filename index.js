const fs            = require('fs');
const EventEmitter  = require('events');
/**
 * InputEvent
 */
class InputEvent extends EventEmitter {
  /**
   * [constructor description]
   * @param  {[type]} device  [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  constructor(device, options){
    super();
    options = { flags: 'r', encoding: null };
    this.fd = fs.createReadStream(device, options);
    this.fd.on('data', this.process.bind(this));
  }
  /**
   * [parse description]
   * @param  {[type]} buf [description]
   * @return {[type]}     [description]
   */
  parse(buf){
    return {
      tssec:   buf.readUInt32LE(0),
      tsusec:  buf.readUInt32LE(4),
      type:    buf.readUInt16LE(8),
      code:    buf.readUInt16LE(10),
      value:   buf.readUInt32LE(12)
    };
  }
  /**
   * [process description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  process(data){
    var evt = this.parse(data);
    this.emit('data', evt);
  }
}
/**
 * [exports InputEvent]
 * @type {[type]}
 */
module.exports = InputEvent;
