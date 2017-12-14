import { LifetimeProcess } from "os/process";
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

    if(_.sum(creep.carry) === 0 && creep.ticksToLive > 100)
    {
      let sourceContainer = <Container>Game.getObjectById(this.metaData.sourceContainer);

      if(!creep.pos.inRangeTo(sourceContainer, 1))
      {
        creep.travelTo(sourceContainer);
      }
      else
      {
        let resource = <Resource[]>sourceContainer.pos.lookFor(RESOURCE_ENERGY)

        if(resource[0].amount > creep.carryCapacity)
        {
          creep.pickup(resource[0]);
        }
        else if(sourceContainer.store.energy > creep.carryCapacity)
        {
          creep.withdraw(sourceContainer, RESOURCE_ENERGY);
        }
        else
        {
          this.log('Suspend');
          this.suspend = 20;
        }
      }
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
  }
}
