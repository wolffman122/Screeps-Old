import { LifetimeProcess } from "os/process";
import { CollectProcess } from "processTypes/creepActions/collect";
import { DeliverProcess } from "processTypes/creepActions/deliver";

export class SpinnerLifetimeProcess extends LifetimeProcess
{
  type = 'slf';

  run()
  {
    let creep = this.getCreep()

    if(!creep)
    {
      return;
    }

    if(_.sum(creep.carry) === 0)
    {
      this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
        target: this.metaData.storageLink,
        creep: creep.name,
        resource: RESOURCE_ENERGY
      });

      return;
    }

    if(creep.room.storage && creep.room.terminal)
    {
      if(creep.room.storage.store.energy < 500000)
      {
        this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
          creep: creep.name,
          target: creep.room.storage.id,
          resource: RESOURCE_ENERGY
        })
      }
      else
      {
        this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
          creep: creep.name,
          target: creep.room.terminal.id,
          resource: RESOURCE_ENERGY
        })
      }
      
      return;
    }
    else
    {
      this.suspend = 15;
    }
  }
}
