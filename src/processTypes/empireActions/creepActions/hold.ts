import { Process } from "os/process";

interface HoldProcessMetaData
{
  creep: string
  flagName: string
}

export class HoldProcess extends Process
{
  metaData: HoldProcessMetaData;
  type = 'hold';

  run()
  {
    let creep = Game.creeps[this.metaData.creep];
    let flag = Game.flags[this.metaData.flagName];

    if(!creep || !flag)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    if(Game.time % 10 == 0)
    {
      let enemies = flag.room.find(FIND_HOSTILE_CREEPS)
      if(enemies.length > 1)
      {
        flag.memory.enemies = true;
      }
      else if (enemies.length == 0)
      {
        flag.memory.enemies = false;
      }
    }

    if(!creep.pos.inRangeTo(creep.room.controller!, 1))
    {
      creep.travelTo(creep.room.controller!)
    }
    else
    {
      creep.reserveController(creep.room.controller!);
    }
  }
}
