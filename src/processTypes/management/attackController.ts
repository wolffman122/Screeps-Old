import { Process } from "os/process";
import { Utils } from "lib/utils";
import { MoveProcess } from "processTypes/creepActions/move";

interface AttackControllerManagementMetaData
{
  creep: string,
  flagName: string
}
export class AttackControllerManagementProcess extends Process
{
  metaData: AttackControllerManagementMetaData;
  type = 'acmp';

  run()
  {
    let flag = Game.flags[this.metaData.flagName];
    let creep = Game.creeps[this.metaData.creep];

    if(!flag)
    {
      this.completed = true;
      return;
    }

    if(!creep)
    {
      let creepName = 'attackC-' + flag.pos.roomName + '-' + Game.time;
      let spawned = Utils.spawn(
        this.kernel,
        this.metaData.flagName,
        'defender',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.creep = creepName;
      }
    }

    if(creep.pos.roomName != flag.pos.roomName)
    {
      this.kernel.addProcess(MoveProcess, 'move-' + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: flag.pos,
        range: 1
      })
    }
    else
    {
      if(!creep.pos.inRangeTo(flag.pos, 1))
      {
        creep.travelTo(flag);
      }
      else
      {
        let spawns = <StructureSpawn[]>creep.room.find(FIND_HOSTILE_SPAWNS);

        if(spawns.length > 0)
        {
          creep.attack(spawns[0]);
        }
      }
    }
  }
}
