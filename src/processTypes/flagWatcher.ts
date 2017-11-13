import {Process} from '../os/process'
import {RemoteMiningManagementProcess} from './management/remoteMining'
//import {RemoteDefenseManagementProcess} from './management/remoteDefense'
import {DismantleManagementProcess} from './management/dismantle'

import {HoldManagementProcess} from './management/hold'
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

  remoteHoldFlag(flag: Flag)
  {
    console.log('Hold Flag');
    this.kernel.addProcessIfNotExist(HoldManagementProcess, 'hmp-' + flag.name, 40, {flag: flag.name });
  }

  remoteDismantleFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(DismantleManagementProcess, 'dmp' + flag.name, 40, {flag: flag.name});
  }

  run()
  {
    this.completed = true;

    let proc = this;

    _.forEach(Game.flags, (flag) => {
      switch(flag.color)
      {
        case COLOR_YELLOW:
          proc.remoteMiningFlag(flag);
          break;
        case COLOR_RED:
          proc.remoteHoldFlag(flag);
          break;
        case COLOR_PURPLE:
          proc.remoteDismantleFlag(flag);
          break;
      }
    })
  }
}
