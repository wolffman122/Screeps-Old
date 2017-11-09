import {Process} from '../../os/process'

import {Utils} from '../../lib/utils'

import {RemoteMinerLifetimeProcess} from '../lifetimes/remoteMiner'

export class RemoteMiningManagementProcess extends Process
{
  type = 'rmmp';

  run()
  {
    let flag = Game.flags[this.metaData.flag];

    if(!flag)
    {
      this.completed = true;
      return;
    }

    if(!flag.memory.source)
    {
      let sources = <Source[]>flag.pos.lookFor(LOOK_SOURCES);
      flag.memory.source = sources[0].id;
    }

    let miningCreep = Game.creeps[this.metaData.miningCreep];
    let deliverRoom = flag.name.split('-')[0];
    console.log(flag.name);

    if(!miningCreep)
    {
      console.log(deliverRoom);
      let spawned = Utils.spawn(
        this.kernel,
        deliverRoom,
        'worker',
        'rm-' + flag.pos.roomName + '-' + Game.time,
        {}
      )

      if(spawned)
      {
        this.metaData.miningCreep = 'rm-' + flag.pos.roomName + '-' + Game.time;
      }
    }
    else
    {
      console.log('Remote add process');
      this.kernel.addProcessIfNotExist(RemoteMinerLifetimeProcess, 'rmlf-' + miningCreep.name, this.priority, {
        creep: miningCreep.name,
        flag: flag.name,
        deliverRoom: deliverRoom
      })
    }
  }
}
