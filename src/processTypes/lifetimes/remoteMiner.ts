import {LifetimeProcess} from '../../os/process'
import {HarvestProcess} from '../creepActions/harvest'
import {DeliverProcess} from '../creepActions/deliver'

export class RemoteMinerLifetimeProcess extends LifetimeProcess
{
  type = 'rmlf'

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
    
    if(_.sum(creep.carry) === 0)
    {
      this.fork(HarvestProcess, 'harves-' + creep.name, this.priority - 1, {
        source: flag.memory.source,
        creep: creep.name
      });

      return;
    }

    if(Game.rooms[this.metaData.deliverRoom].storage)
    {
      this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: Game.rooms[this.metaData.deliverRoom].storage!.id,
        resource: RESOURCE_ENERGY
      });
    }
  }
}
