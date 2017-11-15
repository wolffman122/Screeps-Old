import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'
//import { HarvesterLifetimeProcess } from 'processTypes/lifetimes/harvester';
import { RemoteBuilderLifetimeProcess } from 'processTypes/lifetimes/remoteBuilder';

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

    this.metaData.builderCreeps = Utils.clearDeadCreeps(this.metaData.builderCreeps);
    let numBuilders = _.min([Math.ceil(this.kernel.data.roomData[this.metaData.roomName].constructionSites.length / 10), 3, this.kernel.data.roomData[this.metaData.roomName].constructionSites.length]);

    if(this.metaData.builderCreeps.length < numBuilders)
    {
      let creepName = 'hrm-' + this.metaData.roomName + '-' + Game.time;
      let spawned = Utils.spawn(this.kernel, this.metaData.roomName, 'worker', creepName, {});
      if(spawned)
      {
        this.metaData.builderCreeps.push(creepName);
        this.kernel.addProcess(RemoteBuilderLifetimeProcess, 'rblf-' + creepName, 40, {
          creep: creepName
        })
      }
    }

    let sources = this.kernel.data.roomData[this.metaData.roomName].sources

    _.forEach(sources, (s) => {
      if(!proc.metaData.harvestCreeps[s.id])
      {
        proc.metaData.harvestCreeps[s.id] = [];
      }

      let creepNames = Utils.clearDeadCreeps(proc.metaData.harvestCreeps[s.id]);
      proc.metaData.harvestCreeps[s.id] = creepNames;
      let creeps = Utils.inflateCreeps(creepNames);
      let workRate = Utils.workRate(creeps, 2);

      if(workRate < s.energyCapacity / 300)
      {
        let creepName = 'hrm-' + proc.metaData.roomName + '-' + Game.time;
        let spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'harvester',
          creepName,
          {}
        )

        if(spawned){
          proc.metaData.harvestCreeps[s.id].push(creepName)
        }
      }

      /*_.forEach(creeps, (creep) => {
        proc.kernel.addProcessIfNotExist(RemoteHarvesterLifetimeProcess, 'rhlf-' + creep.name, 39, {
          creep: creep.name,
          source: source.id
        });
      });*/
    });
  }
}
