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

    let targets = [].concat(
      <never[]>this.kernel.data.roomData[creep.room.name].generalContainers
    )

    let deliverTargets = _.filter(targets, (t: DeliveryTarget) => {
      if(t.pos.inRangeTo(t.room.controller, 4))
      {
        if(t.store)
        {
          return (_.sum(t.store) < t.storeCapacity);
        }
      }
    });

    let target = creep.pos.findClosestByPath(deliverTargets);

    if(target)
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
