import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'
//import { HarvesterLifetimeProcess } from 'processTypes/lifetimes/harvester';
import { HolderLifetimeProcess } from 'processTypes/empireActions/lifetimes/holder';
import { HoldBuilderLifetimeProcess } from 'processTypes/empireActions/lifetimes/holderBuild';


export class HoldRoomManagementProcess extends Process
{
  metaData: HoldRoomManagementProcessMetaData;
  type = 'hrm'

  ensureMetaData()
  {
    if(!this.metaData.builderCreeps)
    {
      this.metaData.builderCreeps = [];
    }

    if(!this.metaData.distroCreeps)
    {
      this.metaData.distroCreeps = {};
    }

    if(!this.metaData.harvestCreeps)
    {
      this.metaData.harvestCreeps = {};
    }

    if(!this.metaData.holdCreeps)
    {
      this.metaData.holdCreeps = [];
    }
  }

  run()
  {
    this.ensureMetaData()

    if(!this.kernel.data.roomData[this.metaData.roomName])
    {
      this.completed = true;
      return;
    }

    let proc = this;

    this.metaData.holdCreeps = Utils.clearDeadCreeps(this.metaData.holdCreeps);

    if(this.metaData.holdCreeps.length < 1)
    {
      let creepName = 'hrm-hold-' + proc.metaData.roomName + '-' + Game.time;
      let spawned = Utils.spawn(
        proc.kernel,
        proc.metaData.roomName,
        'hold',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.holdCreeps.push(creepName);
        this.kernel.addProcess(HolderLifetimeProcess, 'holdlf-' + creepName, 20, {
          creep: creepName,
          targetRoom: this.metaData.targetRoom,
          flagName: this.metaData.flagName
        })
      }
    }

    let containerSites = _.filter(this.roomData().constructionSites, c => {
      return (c.structureType === STRUCTURE_CONTAINER);
    });

    if(this.metaData.holdCreeps.length < containerSites.length)
    {
      let creepName = 'hrm-build-' + proc.metaData.roomName + '-' + Game.time;
      let spawned = Utils.spawn(
        proc.kernel,
        proc.metaData.roomName,
        'worker',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.builderCreeps.push(creepName);
        this.kernel.addProcess(HoldBuilderLifetimeProcess, 'holdBuilderlf-' + creepName, 25, {
          creep: creepName,
          targetRoom: this.metaData.targetRoom,
          flagName: this.metaData.flagName
        })
      }

    }



  }
}
