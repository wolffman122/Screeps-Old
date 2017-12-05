import {Process} from '../../os/process'

interface DismantleMetaData
{
  creep: string
}

export class DismantleProcess extends Process
{
  metaData: DismantleMetaData;
  type = 'dismantle'

  run()
  {
    let creep = Game.creeps[this.metaData.creep];

    if(!creep)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    let spawn = this.kernel.data.roomData[creep.pos.roomName].enemySpawns[0];
    let targetPos = spawn.pos;

    if(!creep.pos.inRangeTo(targetPos, 1))
    {
      creep.travelTo(targetPos);
    }
    else
    {
      creep.dismantle(spawn);
    }
  }
}
