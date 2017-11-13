import {LifetimeProcess} from '../../os/process'
import {MoveProcess} from '../creepActions/move'
import {DefendProcess} from '../creepActions/defend'

export class RemoteDefenderLifetimeProcess extends LifetimeProcess
{
  type = 'rdlf';

  run()
  {
    this.log('Remote defender Lifetime');
    let creep  = this.getCreep();
    if(!creep)
    {
      return;
    }

    let flag = Game.flags[this.metaData.flag];

    if(!flag)
    {
      this.completed = true;
      return;
    }

    if(flag.memory.enemies == true)
    {
      if(creep.pos.roomName == flag.pos.roomName)
      {
        let enemies = <Creep[]>flag.pos.findInRange(FIND_HOSTILE_CREEPS, 8);

        if(enemies.length > 0)
        {
          let enemy = creep.pos.findClosestByRange(enemies);

          this.fork(DefendProcess, 'defend-' + creep.name, this.priority -1,{
            creep: creep.name,
            target: enemy.id
          });

          return;
        }

      }
      else
      {
        this.fork(MoveProcess, 'move-' + creep.name, this.priority - 1, {
          creep: creep.name,
          pos: {
            x: flag.pos.x,
            y: flag.pos.y,
            roomName: flag.pos.roomName
          },
          range: 5
        });

        return;
      }
    }
  }
}
