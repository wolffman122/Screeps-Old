import { Process } from "os/process";
import { MoveProcess } from "processTypes/creepActions/move";

interface HoldProcessMetaData
{
  creep: string
}

export class HoldProcess extends Process
{
  metaData: HoldProcessMetaData;
  type = 'hold';

  run()
  {
    let creep = Game.creeps[this.metaData.creep];

    if(!creep)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    if(!creep.pos.inRangeTo(creep.room.controller!, 1))
    {
      this.kernel.addProcess(MoveProcess, creep.name + '-hold-move', this.priority + 1, {
        creep: creep.name,
        pos: creep.room.controller!.pos,
        range: 1
      });

      this.suspend = creep.name + '-hold-move';
    }
    else
    {
      creep.reserveController(creep.room.controller!);
    }
  }
}
