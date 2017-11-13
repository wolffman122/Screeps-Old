import {Process} from '../../os/process'
import {MoveProcess} from './move'

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

    let controller = creep.room.controller;
    let targetPos = controller.pos;

    if(!creep.pos.inRangeTo(targetPos, 1))
    {
      this.kernel.addProcess(MoveProcess, creep.name + '-dismantle-move', this.priority + 1, {
        creep: creep.name,
        pos: {
          x: targetPos.x,
          y: targetPos.y,
          roomName: targetPos.roomName
        },
        range: 1
      });
      this.suspend = creep.name + '-dismantle-move';
    }
    else
    {
      creep.dismantle(controller);
    }
  }
}
