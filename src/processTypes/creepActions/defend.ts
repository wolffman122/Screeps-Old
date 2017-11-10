import {MoveProcess} from './move'
import {Process} from '../../os/process'

interface DefendProcessMetaData
{
  creep: string
  target: string
}

export class DefendProcess extends Process
{
  metaData: DefendProcessMetaData;
  type = 'defend';

  run()
  {
    let creep = Game.creeps[this.metaData.creep];
    let enemy = <Creep>Game.getObjectById(this.metaData.target);

    if(!creep || !enemy)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    if(!creep.pos.inRangeTo(enemy, 1))
    {
      this.kernel.addProcess(MoveProcess, creep.name + '-defend-move', this.priority + 1, {
        creep: creep.name,
        pos: {
          x: enemy.pos.x,
          y: enemy.pos.y,
          roomName: enemy.pos.roomName
        },
        range: 1
      });
      this.suspend = creep.name + '-defend-move';
    }
    else
    {
      creep.attack(enemy);
    }
  }
}
