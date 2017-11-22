import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'
//import { HarvesterLifetimeProcess } from 'processTypes/lifetimes/harvester';
import { HolderLifetimeProcess } from 'processTypes/empireActions/lifetimes/holder';
import { HoldBuilderLifetimeProcess } from 'processTypes/empireActions/lifetimes/holderBuilder';



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

    let spawnRoom = this.metaData.flagName.split('-')[0];

    if(!this.kernel.data.roomData[spawnRoom])
    {
      this.log('Hold Room finished early');
      this.completed = true;
      return;
    }

    let proc = this;

    this.metaData.holdCreeps = Utils.clearDeadCreeps(this.metaData.holdCreeps);

    if(this.metaData.holdCreeps.length < 1)
    {
      let creepName = 'hrm-hold-' + spawnRoom + '-' + Game.time;
      let spawned = Utils.spawn(
        proc.kernel,
        spawnRoom,
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

    if(this.kernel.data.roomData[this.metaData.targetRoom].constructionSites)
    {
      let containerSites = _.filter(this.kernel.data.roomData[this.metaData.targetRoom].constructionSites, c => {
        return (c.structureType === STRUCTURE_CONTAINER);
      });

      this.metaData.builderCreeps = Utils.clearDeadCreeps(this.metaData.builderCreeps);

      if(this.metaData.builderCreeps.length < containerSites.length)
      {
        let creepName = 'hrm-build-' + spawnRoom + '-' + Game.time;
        let spawned = Utils.spawn(
          proc.kernel,
          spawnRoom,
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

    if(this.kernel.data.roomData[this.metaData.targetRoom].sourceContainers)
    {
      let containers = _.filter(this.kernel.data.roomData[this.metaData.targetRoom].sourceContainers, c => {
        return (c.structureType === STRUCTURE_CONTAINER);
      });

      if(containers.length > 0)
      {
        this.log('Containers now need to harves into them');
      }
    }
  }
}
