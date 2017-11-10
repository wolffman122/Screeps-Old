import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'
import {HolderLifetimeProcess} from '../lifetimes/holder'


export class HoldManagementProcess extends Process
{
  type = 'hmp';

  run()
  {
    let flag = Game.flags[this.metaData.flag];

    if(!flag)
    {
      this.completed = true;
      return;
    }

    let holdingCreep = Game.creeps[this.metaData.holdingCreep];
    let deliverRoom = flag.name.split('-')[0];

    if(!holdingCreep)
    {
      let spawned = Utils.spawn(
        this.kernel,
        deliverRoom,
        'claimer',
        'hd-' + flag.pos.roomName + '-' + Game.time,
        {}
      );

      if(spawned)
      {
        this.metaData.holdingCreep = 'hd-' + flag.pos.roomName + '-' + Game.time;
      }
    }
    else
    {
      this.kernel.addProcessIfNotExist(HolderLifetimeProcess, 'hlf-' + holdingCreep.name, this.priority, {
        creep: holdingCreep.name,
        flag: flag.name,
        deliverRoom: deliverRoom
      })
    }
  }

}
