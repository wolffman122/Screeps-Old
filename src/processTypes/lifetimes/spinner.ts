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

    let flag = Game.flags['DJ-' + creep.pos.roomName];

    if(flag)
    {
      if(!creep.pos.inRangeTo(flag, 0))
      {
        creep.travelTo(flag); 
      }
    }

    if(_.sum(creep.carry) === 0)
    {
      if(this.kernel.data.roomData[creep.room.name].sourceLinks.length > 0)
      {
        let link = <StructureLink>Game.getObjectById(this.metaData.storageLink);
        if(link && link.energy > 0)
        {
          this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
            target: this.metaData.storageLink,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          });
        }
        else if (creep.room.terminal.store.energy > 100000)
        {
          let collectAmount = creep.room.terminal.store.energy - 100000;
          if(collectAmount < creep.carryCapacity)
          {
            this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
              target: creep.room.terminal.id,
              creep: creep.name,
              resource: RESOURCE_ENERGY,
              collectAmount: collectAmount
            });
          }
          else
          {
            this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
              target: creep.room.terminal.id,
              creep: creep.name,
              resource: RESOURCE_ENERGY,
            });
          }
        }
        else
        {
          this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
            target: creep.room.storage.id,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          });
        }
      }
      return;
    }

    if(creep.room.storage && creep.room.terminal)
    {
      if(this.kernel.data.roomData[creep.room.name].sourceLinks.length > 0)
      {
        if(creep.room.terminal.store.energy < 100000)
        {
          this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
            creep: creep.name,
            target: creep.room.terminal.id,
            resource: RESOURCE_ENERGY
          })
        }
        else
        {
          this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
            creep: creep.name,
            target: creep.room.storage.id,
            resource: RESOURCE_ENERGY
          })
        }
      }
      return;
    }
    else
    {
      this.suspend = 15;
    }
  }
}
