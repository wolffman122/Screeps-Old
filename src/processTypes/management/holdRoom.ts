import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'
//import { HarvesterLifetimeProcess } from 'processTypes/lifetimes/harvester';
import { HolderLifetimeProcess } from 'processTypes/empireActions/lifetimes/holder';
import { HoldBuilderLifetimeProcess } from 'processTypes/empireActions/lifetimes/holderBuilder';
import { HoldHarvesterLifetimeProcess } from 'processTypes/empireActions/lifetimes/holderHarvester';
import { HoldDistroLifetimeProcess } from 'processTypes/empireActions/lifetimes/holderDistro';
import { HoldWorkerLifetimeProcess } from 'processTypes/empireActions/lifetimes/holdWorker';



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

    if(!this.metaData.workerCreeps)
    {
      this.metaData.workerCreeps = [];
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
    this.metaData.workerCreeps = Utils.clearDeadCreeps(this.metaData.workerCreeps);

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

    let constructionSites = this.kernel.data.roomData[this.metaData.targetRoom].constructionSites;

    if(constructionSites.length > 0)
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

    if(this.kernel.data.roomData[this.metaData.targetRoom].sourceContainers.length > 0)
    {
      let containers = _.filter(this.kernel.data.roomData[this.metaData.targetRoom].sourceContainers, c => {
        return (c.structureType === STRUCTURE_CONTAINER);
      });

      if(containers.length > 0)
      {
        let sources = this.kernel.data.roomData[this.metaData.targetRoom].sources;

        _.forEach(sources, function(source) {
          if(!proc.metaData.harvestCreeps[source.id])
          {
            proc.metaData.harvestCreeps[source.id] = [];
          }

          let creepNames = Utils.clearDeadCreeps(proc.metaData.harvestCreeps[source.id])
          proc.metaData.harvestCreeps[source.id] = creepNames;
          let creeps = Utils.inflateCreeps(creepNames);
          let workRate = Utils.workRate(creeps, 2);

          if(workRate < source.energyCapacity / 300)
          {
            console.log("Need to make some harvesting creeps " + source.id);
            let creepName = 'hrm-harvest-' + spawnRoom + '-' + Game.time;
            let spawned = Utils.spawn(
              proc.kernel,
              spawnRoom,
              'harvester',
              creepName,
              {}
            )

            if(spawned)
            {
              proc.metaData.harvestCreeps[source.id].push(creepName);
            }
          }

          _.forEach(creeps, function(creep){
            if(!proc.kernel.hasProcess('holdHarvesterlf-' + creep.name))
            {
              proc.kernel.addProcess(HoldHarvesterLifetimeProcess, 'holdHarvesterlf-' + creep.name, 27, {
                creep: creep.name,
                source: source.id
              });
            }
          });
        });
      }

      _.forEach(this.kernel.data.roomData[this.metaData.targetRoom].sourceContainers, function(container){
        if(proc.metaData.distroCreeps[container.id])
        {
          let creep = Game.creeps[proc.metaData.distroCreeps[container.id]];
          if(!creep)
          {
            delete proc.metaData.distroCreeps[container.id];
            return;
          }
        }
        else
        {
          let creepName = 'hrm-m-' + spawnRoom + '-' + Game.time;
          let spawned = Utils.spawn(
            proc.kernel,
            spawnRoom,
            'holdmover',
            creepName,
            {}
          );

          if(spawned)
          {
            proc.metaData.distroCreeps[container.id] = creepName;
            if(!proc.kernel.hasProcess('holdDistrolf-' + creepName))
            {
              proc.kernel.addProcess(HoldDistroLifetimeProcess, 'holdDistrolf-' + creepName, 26, {
                sourceContainer: container.id,
                spawnRoom: spawnRoom,
                creep: creepName
              })
            }
          }
        }
      })
    }

    if(this.metaData.workerCreeps.length < this.kernel.data.roomData[this.metaData.targetRoom].sourceContainers.length)
    {
      let creepName = 'hrm-worker-' + spawnRoom + '-' + Game.time;
      let spawned = Utils.spawn(
        proc.kernel,
        spawnRoom,
        'worker',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.workerCreeps.push(creepName);
        this.kernel.addProcess(HoldWorkerLifetimeProcess, 'holdWorkerlf-' + creepName, 22, {
          creep: creepName,
          targetRoom: this.metaData.targetRoom,
          flagName: this.metaData.flagName
        });
      }
    }
  }
}
