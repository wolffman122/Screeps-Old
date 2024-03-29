import {Process} from '../../os/process'

import {RoomDataProcess} from '../roomData'
import {EnergyManagementProcess} from '../management/energy'
import {SuspensionProcess} from './suspension'
import {StructureManagementProcess} from '../management/structure'
import {DefenseManagementProcess} from '../management/defense'
import {FlagWatcherProcess} from '../flagWatcher'
import { LinkManagementProcess } from 'processTypes/management/link';
import { MarketManagementProcess } from 'processTypes/management/market';
import { TerminalManagementProcess } from 'processTypes/buildingProcesses/terminal';
import { MinetalTerminalManagementProcess } from '../buildingProcesses/mineralTerminal';
import { LabManagementProcess } from 'processTypes/management/lab';

/*


import {StructureManagementProcess} from '../management/structure'
import {SuspensionProcess} from './suspension'
*/
export class InitProcess extends Process{
  type = 'init'

  /** Run the init process */
  run(){
    let proc = this

    if(Game.cpu.bucket > 3000){
      this.kernel.limit = (Game.cpu.limit + 500) - 20
    }

    for(var name in Memory.creeps){
      if(!Game.creeps[name]){
        delete Memory.creeps[name]
      }
    }

    _.forEach(Game.rooms, function(room){
      proc.kernel.addProcess(RoomDataProcess, 'roomData-' + room.name, 99, {
        roomName: room.name
      })

      if(!proc.kernel.getProcessByName('em-' + room.name)){
        proc.kernel.addProcess(EnergyManagementProcess, 'em-' + room.name, 50, {
          roomName: room.name
        })
      }

      if(!proc.kernel.hasProcess('sm-' + room.name)){
        proc.kernel.addProcess(StructureManagementProcess, 'sm-' + room.name, 48, {
          roomName: room.name
        })
      }

      if(!proc.kernel.hasProcess('dm-' + room.name))
      {
        proc.kernel.addProcess(DefenseManagementProcess, 'dm-' + room.name, 70, {
          roomName: room.name
        })
      }

      if(Game.rooms[room.name].controller)
      {
        if(Game.rooms[room.name].controller.my)
        {
          if(!proc.kernel.hasProcess('lm-' + room.name))
          {
            proc.kernel.addProcess(LinkManagementProcess, 'lm-' + room.name, 60, {
              roomName: room.name
            });
          }

          if(Game.rooms[room.name].controller.level >= 8)
          {
            if(room.name == 'E45S48' || room.name === 'E48S49' || room.name === 'E43S52' ||
              room.name == 'E45S57')
            {
              if(!proc.kernel.hasProcess('labm-' + room.name))
              {
                proc.kernel.addProcess(LabManagementProcess, 'labm-' + room.name, 30, {
                  roomName: room.name
                });
              }
            }
          }
        }
      }
    })

    this.kernel.addProcess(SuspensionProcess, 'suspension-master', 99, {master: true})
    this.kernel.addProcess(FlagWatcherProcess, 'flag-watcher', 98, {})
    this.kernel.addProcess(MarketManagementProcess, 'market', 20, {});
    this.kernel.addProcess(TerminalManagementProcess, 'terminal', 15, {});
    this.kernel.addProcess(MinetalTerminalManagementProcess, 'mineralTerminal', 14,  {});

    this.completed = true
  }
}
