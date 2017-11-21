import { LifetimeProcess } from "os/process";
import { MoveProcess } from "processTypes/creepActions/move";
import { BuildProcess } from "processTypes/creepActions/build";
import { Utils } from "lib/utils";
import { CollectProcess } from "processTypes/creepActions/collect";

interface HoldBuilderLifetimeProcessMetaData
{
  creep: string
  targetRoom: string
  flagName: string
}
export class HoldBuilderLifetimeProcess extends LifetimeProcess
{
  type = 'holdBuilderlf';
  metaData: HoldBuilderLifetimeProcessMetaData;

  run()
  {

    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    let room = Game.rooms[this.metaData.targetRoom];

    if(!room)
    {
      this.fork(MoveProcess, 'move-' + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: Game.flags[this.metaData.flagName].pos,
        range: 5
      });

      return;
    }

    if(_.sum(creep.carry) === 0)
    {
      let target = Utils.withdrawTarget(creep, this);
      if(target)
      {
        this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
          creep: creep.name,
          target: target.id,
          resource: RESOURCE_ENERGY
        });

        return;
      }
      else
      {
        this.suspend = 10;
      }
    }

    let target = creep.pos.findClosestByRange(this.roomData().constructionSites);

    if(target)
    {
      this.fork(BuildProcess, 'build-' + creep.name, this.priority - 1, {
        creep: creep.name,
        site: target.id
      });

      return
    }
    else
    {
      creep.say('spare');
    }
  }
}
