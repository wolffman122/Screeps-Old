import { Process } from "os/process";

interface StrengthenProcessMetaData
{
  creep: string,
  target: string,
  maxAmount: number
}

export class StrengthenProcess extends Process
{
  type = 'strengthen';
  metaData: StrengthenProcessMetaData;

  run()
  {
    let creep = Game.creeps[this.metaData.creep]
    let target = <StructureRampart>Game.getObjectById(this.metaData.target);

    if(!creep || _.sum(creep.carry.energy) === 0)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    if(creep && !target)
    {
      M
    }

    if(!creep.pos.inRangeTo())
  }

}
