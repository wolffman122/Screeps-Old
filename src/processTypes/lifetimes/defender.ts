import {LifetimeProcess} from '../../os/process'

import {DefendProcess} from '../creepActions/defend'

export class DefenderLifetimeProcess extends LifetimeProcess
{
  type = 'deflf'

  run()
  {
    console.log('Running Defender Lifetime');

    let creep = this.getCreep();

    if(!creep)
    {
      return;
    }

    let room = Game.rooms[creep.room.name];
    let enemies = <Creep[]>room.find(FIND_HOSTILE_CREEPS);

    if(enemies.length > 0)
    {
      console.log('Lifetime found enemies');
      let enemy = creep.pos.findClosestByRange(enemies);

      this.fork(DefendProcess, 'defend-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: enemy.id
      });
    }
    else
    {
      console.log('Lifetime did not find enemies1');
      this.suspend = 10;
    }
  }
}
