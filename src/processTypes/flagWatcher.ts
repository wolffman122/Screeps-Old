import {Process} from '../os/process'
import {RemoteMiningManagementProcess} from './management/remoteMining'
//import {RemoteDefenseManagementProcess} from './management/remoteDefense'
import {DismantleManagementProcess} from './management/dismantle'

import {ClaimProcess} from '../processTypes/empireActions/claim'
//import {HoldProcess} from '../processTypes/empireActions/hold'
import {TransferProcess} from '../processTypes/empireActions/transfer'

import { HoldRoomManagementProcess } from 'processTypes/management/holdRoom';

export class FlagWatcherProcess extends Process
{
  type='flagWatcher';


  remoteMiningFlag(flag: Flag)
  {
    if(flag.memory.enemies)
    {
      //this.kernel.addProcessIfNotExist(RemoteDefenseManagementProcess, 'rdmp-' + flag.name, 45,  { flag: flag.name })
    }
    this.kernel.addProcessIfNotExist(RemoteMiningManagementProcess, 'rnmp-' + flag.name, 40, { flag: flag.name })
  }

remoteDismantleFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(DismantleManagementProcess, 'dmp' + flag.name, 40, {flag: flag.name});
  }

  claimFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(ClaimProcess, 'claim-' + flag.name, 20, { targetRoom: flag.pos.roomName, flagName: flag.name});
  }

  /*holdFlag(flag: Flag)
  {
    this.log("Hold Function")
    this.kernel.addProcessIfNotExist(HoldProcess, 'hold-' + flag.name, 20, {targetRoom: flag.pos.roomName, flagName: flag.name});
  }*/

  remoteHoldFlag(flag: Flag)
  {
    console.log('Hold Management Process');
    this.kernel.addProcessIfNotExist(HoldRoomManagementProcess, 'hrmp-' + flag.name, 30, {targetRoom: flag.pos.roomName, flagName: flag.name});
  }

  transferFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(TransferProcess, 'transfer-' + flag.name, 25, {sourceRoom: flag.pos.roomName, destinationRoom: flag.name});
  }

  run()
  {
    this.completed = true;

    let proc = this;

    _.forEach(Game.flags, (flag) => {
      switch(flag.color)
      {
        case COLOR_BLUE:
          proc.claimFlag(flag);
          break;
        case COLOR_YELLOW:
          proc.remoteMiningFlag(flag);
          break;
        case COLOR_RED:
          proc.remoteHoldFlag(flag);
          break;
        case COLOR_PURPLE:
          proc.remoteDismantleFlag(flag);
          break;
        /*case COLOR_BROWN:
          proc.holdFlag(flag)
          break;*/
        case COLOR_ORANGE:
          proc.transferFlag(flag);
          break;

      }
    })
  }
}
