import {Process} from '../os/process'
import {RemoteMiningManagementProcess} from './management/remoteMining'

export class FlagWatcherProcess extends Process
{
  type='flagWatcher';


  remoteMiningFlag(flag: Flag)
  {
    this.kernel.addProcessIfNotExist(RemoteMiningManagementProcess, 'rnmp-' + flag.name, 40, { flag: flag.name })
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
      }
    })
  }
}
