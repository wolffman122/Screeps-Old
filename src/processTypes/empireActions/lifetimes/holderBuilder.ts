import { LifetimeProcess } from "os/process";
import { MoveProcess } from "processTypes/creepActions/move";
import { BuildProcess } from "processTypes/creepActions/build";
import { Utils } from "lib/utils";
import { CollectProcess } from "processTypes/creepActions/collect";
import { HarvestProcess } from "processTypes/creepActions/harvest";
//import { HarvestProcess } from "processTypes/creepActions/harvest";

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
    this.log('Holder Builder LF');
    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    let room = Game.rooms[this.metaData.targetRoom];

    this.log('In Remote build');

    if(room.name != creep.pos.roomName)
    {
      this.log('Move remote build');
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
        if( this.kernel.data.roomData[creep.room.name].sources)
        {
          let source = creep.pos.findClosestByRange( this.kernel.data.roomData[creep.room.name].sources);

          this.fork(HarvestProcess, 'harvest-' + creep.name, this.priority - 1, {
            creep: creep.name,
            source: source.id
          });

          return;
        }
      }
    }

    let target = creep.pos.findClosestByRange(this.kernel.data.roomData[this.metaData.targetRoom].constructionSites);

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
