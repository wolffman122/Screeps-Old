import {LifetimeProcess} from '../../os/process'
import {HarvestProcess} from '../creepActions/harvest'
import {DeliverProcess} from '../creepActions/deliver'
import {MoveProcess} from '../creepActions/move'
export class RemoteMinerLifetimeProcess extends LifetimeProcess
{
  type = 'rmlf'

  run()
  {
    this.log('Remote Miner Lifetime')
    let creep = this.getCreep();
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

    if(_.sum(creep.carry) === 0)
    {
      if(creep.pos.roomName == flag.pos.roomName)
      {
        let enemies = flag.room.find(FIND_HOSTILE_CREEPS)
        if(enemies.length > 1)
        {
          flag.memory.enemies = true;
        }
        else if (enemies.length == 0)
        {
          flag.memory.enemies = false;
        }

        this.fork(HarvestProcess, 'harvest-' + creep.name, this.priority - 1, {
          source: flag.memory.source,
          creep: creep.name,
          flagName: flag.name
        });

        return;
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
          range: 1
        });

        return;
      }
    }

    if(Game.rooms[this.metaData.deliverRoom].storage)
    {
      this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: Game.rooms[this.metaData.deliverRoom].storage!.id,
        resource: RESOURCE_ENERGY
      });
    }
  }
}
