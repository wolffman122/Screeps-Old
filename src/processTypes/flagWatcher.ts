import {Process} from '../os/process'
import {RemoteMiningManagementProcess} from './management/remoteMining'
import {HoldManagementProcess} from './management/hold'
export class FlagWatcherProcess extends Process
{
  type='flagWatcher';


  remoteMiningFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(RemoteMiningManagementProcess, 'rnmp-' + flag.name, 40, { flag: flag.name })
  }

  remoteHoldFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(HoldManagementProcess, 'hmp-' + flag.name, 40, {flag: flag.name });
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
      }
    })
  }
}
