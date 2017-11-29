import { LifetimeProcess } from "os/process";
import { HarvestProcess } from "processTypes/creepActions/harvest";
import { DeliverProcess } from "processTypes/creepActions/deliver";


export class HoldHarvesterLifetimeProcess extends LifetimeProcess
{
  type = 'holdHarvesterlf';

  run()
  {
    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    if(_.sum(creep.carry) === 0)
    {
      this.fork(HarvestProcess, 'harvest-' + creep.name, this.priority - 1, {
        source: this.metaData.source,
        creep: creep.name
      })

      return;
    }

    if(this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source])
    {
      let container = this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source];

      if(_.sum(container.store) < container.storeCapacity)
      {
        this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
          target: container.id,
          creep: creep.name,
          resource: RESOURCE_ENERGY
        })
      }
    }
  }
}
