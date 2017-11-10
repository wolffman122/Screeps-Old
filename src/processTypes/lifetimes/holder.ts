import {LifetimeProcess} from '../../os/process'
import {MoveProcess} from '../creepActions/move'
import {HoldProcess} from '../creepActions/hold'

export class HolderLifetimeProcess extends LifetimeProcess
{
  type = 'hdlf';

  run()
  {
    let creep = this.getCreep();
    if(!creep)
    {
      return;
    }

    let flag = Game.flags[this.metaData.flag];

    if(!flag)
    {
      this.completed = true;
      return;
    }

    if(creep.pos.roomName != flag.pos.roomName)
    {
      this.fork(MoveProcess, 'move-' + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: {
          x: flag.pos.x,
          y: flag.pos.y,
          roomName: flag.pos.roomName
        },
        range: 1
      });

      return;
    }
    else
    {
      this.fork(HoldProcess, 'hold-' + creep.name, this.priority - 1,{
        creep: creep.name
      })
    }
  }
}
