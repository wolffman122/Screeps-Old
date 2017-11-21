import { LifetimeProcess } from 'os/process';
import {MoveProcess} from '../../creepActions/move';
import { HoldProcess } from 'processTypes/empireActions/creepActions/hold';

interface HolderLifetimeProcessMetaData
{
  creep: string
  targetRoom: string
  flagName: string
}

export class HolderLifetimeProcess extends LifetimeProcess
{
  type = 'holdlf';
  metaData: HolderLifetimeProcessMetaData;

  run()
  {
    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    let room = Game.rooms[this.metaData.targetRoom];

    if(!room)
    {
      this.fork(MoveProcess, 'move-' + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: Game.flags[this.metaData.flagName].pos,
        range: 1
      });

      return;
    }

    this.fork(HoldProcess, 'hold-' + creep.name, this.priority - 1, {
      creep: creep.name
    });
  }
}
