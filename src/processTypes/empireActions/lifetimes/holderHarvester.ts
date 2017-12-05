import { LifetimeProcess } from "os/process";
import { HarvestProcess } from "processTypes/creepActions/harvest";
import { DeliverProcess } from "processTypes/creepActions/deliver";
import { RepairProcess } from "processTypes/creepActions/repair";


export class HoldHarvesterLifetimeProcess extends LifetimeProcess
{
  type = 'holdHarvesterlf';

  run()
  {
    let creep = this.getCreep();
    let flag = Game.flags[this.metaData.flagName];

    if(!flag)
    {
      this.completed = true;
      return;
    }

    if(!creep)
    {
      return;
    }

    if(Game.time % 10 === 5)
    {
      let enemies = flag.room.find(FIND_HOSTILE_CREEPS);
      this.log('Enemies ' + enemies.length);
      if(enemies.length > 0)
      {
        flag.memory.enemies = true;
      }
      else
      {
        flag.memory.enemies = false;
      }
    }

    let source = <Source>Game.getObjectById(this.metaData.source);

    if(this.kernel.data.roomData[source.room.name].sourceContainerMaps[source.id])
    {
      let container = this.kernel.data.roomData[source.room.name].sourceContainerMaps[source.id];
      if(!creep.pos.inRangeTo(container, 0))
      {
        creep.travelTo(container);
      }

      if(container.store.energy < container.storeCapacity)
      {
        creep.harvest(source);
        creep.transfer(container, RESOURCE_ENERGY);
      }
      else
      {
        this.suspend = 10;
      }

    }
    else
    {
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

        if(container.hits < container.hitsMax)
        {
          this.fork(RepairProcess, 'repair-' + creep.name, this.priority - 1, {
            creep: creep.name,
            target: container.id
          })
          return;
        }

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
}
