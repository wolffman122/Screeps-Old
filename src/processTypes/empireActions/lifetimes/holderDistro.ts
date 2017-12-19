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
      this.log('range');
      if(!creep.pos.inRangeTo(sourceContainer, 1))
      {
        this.log('need to move');
        creep.travelTo(sourceContainer);
        return;
      }
      else
      {
        let resource = <Resource[]>sourceContainer.pos.lookFor(RESOURCE_ENERGY)
        if(resource.length > 0)
        {
          if(resource[0].amount > creep.carryCapacity)
          {
            creep.pickup(resource[0]);
          }
          else if(sourceContainer.store.energy > creep.carryCapacity)
          {
            creep.withdraw(sourceContainer, RESOURCE_ENERGY)
          }
          else
          {
            this.suspend = 10;
          }
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

    if(this.kernel.data.roomData[this.metaData.spawnRoom].links.length > 0)
    {
      if(creep.pos.roomName != this.metaData.spawnRoom)
      {
        if(!creep.fixMyRoad())
        {
          let rName: string = this.metaData.spawnRoom;
          creep.moveTo(new RoomPosition(25,25, rName), {range: 24})
        }

      }
      else
      {
        let links = _.filter(this.kernel.data.roomData[this.metaData.spawnRoom].links, (l) => {
          return (l.energy < l.energyCapacity);
        });

        links = creep.pos.findInRange(links, 6);

        let link = creep.pos.findClosestByPath(links);

        if(link.energy < link.energyCapacity)
        {
          this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
            creep: creep.name,
            target: link.id,
            resource: RESOURCE_ENERGY
          });

          return;
        }
        else
        {
          this.suspend = 2;
        }
      }
    }
    else
    {
      // creep is filled
      if(Game.rooms[this.metaData.spawnRoom].storage)
      {
        this.log('Doing sotrage route');
        let target = Game.rooms[this.metaData.spawnRoom].storage;

        this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
          creep: creep.name,
          target: target.id,
          resource: RESOURCE_ENERGY
        });
      }
    }
  }
}
