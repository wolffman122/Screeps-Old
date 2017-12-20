import { LifetimeProcess } from "os/process";
import { CollectProcess } from "processTypes/creepActions/collect";
import { DeliverProcess } from "processTypes/creepActions/deliver";

export class MineralDistroLifetimeProcess extends LifetimeProcess
{
  type = 'mdlf';

  run()
  {
    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    if(_.sum(creep.carry) === 0 && creep.ticksToLive > 50)
    {
      let container = <Container>Game.getObjectById(this.metaData.container);

      if(container.store[this.metaData.mineralType] >= creep.carryCapacity)
      {
        this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
          target: container.id,
          creep: creep.name,
          resource: this.metaData.mineralType
        });

        return;
      }
      else
      {
        this.suspend = 10;
      }
    }

    this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
      target: creep.room.storage,
      creep: creep.name,
      resource: this.metaData.mineralType
    });
  }
}
