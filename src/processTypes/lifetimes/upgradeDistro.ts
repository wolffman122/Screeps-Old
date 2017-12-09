import { LifetimeProcess } from "os/process";
import { CollectProcess } from "processTypes/creepActions/collect";
import { DeliverProcess } from "processTypes/creepActions/deliver";

export class UpgradeDistroLifetimeProcess extends LifetimeProcess
{
  type = 'udlf';

  run()
  {
    let creep = this.getCreep();

    if(!creep)
    {
      return
    }

    if(_.sum(creep.carry) === 0)
    {
      let storage = creep.room.storage;

      if(storage.store.energy > creep.carryCapacity)
      {
        this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
          target: storage.id,
          creep: creep.name,
          resource: RESOURCE_ENERGY
        })

        return;
      }
    }



    let target = this.kernel.data.roomData[creep.room.name].controllerContainer;

    if(target && _.sum(target.store) < target.storeCapacity)
    {
      this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: target.id,
        resource: RESOURCE_ENERGY
      });
    }
    else
    {
      this.suspend = 5;
    }
  }
}
