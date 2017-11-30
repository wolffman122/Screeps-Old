import { LifetimeProcess } from "os/process";
import { CollectProcess } from "processTypes/creepActions/collect";
import { DeliverProcess } from "processTypes/creepActions/deliver";


export class HoldDistroLifetimeProcess extends LifetimeProcess
{
  type = 'holdDistrolf';

  run()
  {
    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    if(_.sum(creep.carry) === 0 && creep.ticksToLive > 75)
    {
      let sourceContainer = <Container>Game.getObjectById(this.metaData.sourceContainer);

      if(sourceContainer.store.energy > 0)
      {
        this.fork(CollectProcess, 'collec-' + creep.name, this.priority - 1, {
          target: this.metaData.sourceContainer,
          creep: creep.name,
          resource: RESOURCE_ENERGY
        });
      }

      return;
    }

    // creep is filled
    if(Game.rooms[this.metaData.spawnRoom].storage)
    {
      let target = Game.rooms[this.metaData.spawnRoom].storage;

      this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: target.id,
        resource: RESOURCE_ENERGY
      });
    }
    else
    {
      this.suspend = 15
    }
  }


}
