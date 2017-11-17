import {LifetimeProcess} from '../../os/process'
import {Utils} from '../../lib/utils'
import { CollectProcess } from 'processTypes/creepActions/collect';
import { StrengthenProcess } from 'processTypes/creepActions/strengthen';

export class RampartStrengthenerLifetimeProcess extends LifetimeProcess
{
  type = 'rplf';

  run()
  {
    let creep = this.getCreep();
    let maxAmount = this.metaData.maxAmount;

    this.log('Rampart Strengthener LF Max Amount ' + maxAmount);

    if(!creep)
    {
      return;
    }

    if(_.sum(creep.carry) === 0)
    {
      let target = Utils.withdrawTarget(creep, this);
      if(target)
      {
        this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
          creep: creep.name,
          target: target.id,
          resource: RESOURCE_ENERGY
        });

        return;
      }
      else
      {
        this.suspend = 10;
      }
      return;
    }

    let ramparts = this.kernel.data.roomData[creep.pos.roomName].ramparts

    let rampHitTotal = _.sum(ramparts, r => r.hits);
    let rampAvg = rampHitTotal / ramparts.length;

    let lowestRamparts = _.filter(ramparts, r => {
      return (r.hits < rampAvg);
    });

    let target = creep.pos.findClosestByPath(lowestRamparts);

    if(target)
    {
      this.fork(StrengthenProcess, 'strengthen-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: target.id
        maxAmount: maxAmount
      });
    }

  }

}
