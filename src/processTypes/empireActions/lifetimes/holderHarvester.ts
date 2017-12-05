import { LifetimeProcess } from "os/process";

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

      creep.harvest(source);

      if(container.hits <= container.hitsMax * .9 && _.sum(creep.carry) > 0)
      {
        creep.repair(container);
      }

      if(container.store.energy < container.storeCapacity && _.sum(creep.carry) == creep.carryCapacity )
      {
        creep.transfer(container, RESOURCE_ENERGY);
      }
    }
  }
}
