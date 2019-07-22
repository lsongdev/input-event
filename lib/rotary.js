const InputEvent  = require('./');

const ROTARY_STATUS = {
  ROTARY_LEFT  :  1,
  ROTARY_RIGHT : -1
};

class Rotary extends InputEvent {
  parse(ev){
    // filting rotary event
    if(InputEvent.EVENT_TYPES.EV_REL == ev.type){
      switch(ev.value){
        case ROTARY_STATUS.ROTARY_LEFT:
          this.emit('left', ev);
          break;
        case ROTARY_STATUS.ROTARY_RIGHT:
          this.emit('right', ev);
          break;
      }
    }
  }
}

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = Rotary;
