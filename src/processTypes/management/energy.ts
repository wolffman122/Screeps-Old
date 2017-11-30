import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'

import {HarvesterLifetimeProcess} from '../lifetimes/harvester'
import {DistroLifetimeProcess} from '../lifetimes/distro'
import {UpgraderLifetimeProcess} from '../lifetimes/upgrader'
import { SpinnerLifetimeProcess } from 'processTypes/lifetimes/spinner';

export class EnergyManagementProcess extends Process{
  metaData: EnergyManagementMetaData

  type = 'em'

  ensureMetaData(){
    if(!this.metaData.harvestCreeps)
      this.metaData.harvestCreeps = {}

    if(!this.metaData.distroCreeps)
      this.metaData.distroCreeps = {}

    if(!this.metaData.upgradeCreeps)
      this.metaData.upgradeCreeps = []

    if(!this.metaData.spinCreeps)
      this.metaData.spinCreeps = []
  }

  run(){
    this.ensureMetaData()

    if(!this.kernel.data.roomData[this.metaData.roomName])
    {
      this.completed = true
      return
    }

    let proc = this
    let sources = this.kernel.data.roomData[this.metaData.roomName].sources


    _.forEach(sources, function(source)
    {
      if(!proc.metaData.harvestCreeps[source.id])
        proc.metaData.harvestCreeps[source.id] = []

      let creepNames = Utils.clearDeadCreeps(proc.metaData.harvestCreeps[source.id])
      proc.metaData.harvestCreeps[source.id] = creepNames
      let creeps = Utils.inflateCreeps(creepNames)
      let workRate = Utils.workRate(creeps, 2)

      if(workRate < source.energyCapacity / 300) { //300
        let creepName = 'em-' + proc.metaData.roomName + '-' + Game.time
        let spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'harvester',
          creepName,
          {}
        )

        if(spawned){
          proc.metaData.harvestCreeps[source.id].push(creepName)
        }
      }

      _.forEach(creeps, function(creep){
        if(!proc.kernel.hasProcess('hlf-' + creep.name)){
          proc.kernel.addProcess(HarvesterLifetimeProcess, 'hlf-' + creep.name, 49, {
            creep: creep.name,
            source: source.id
          })
        }
      })
    })

    _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, function(container){
      if(proc.metaData.distroCreeps[container.id])
      {
        let creep = Game.creeps[proc.metaData.distroCreeps[container.id]]
        if(!creep){
          delete proc.metaData.distroCreeps[container.id]
          return
        }
      }
      else
      {
        let creepName = 'em-m-' + proc.metaData.roomName + '-' + Game.time
        let spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'mover',
          creepName,
          {}
        )

        if(spawned){
          proc.metaData.distroCreeps[container.id] = creepName
          proc.kernel.addProcess(DistroLifetimeProcess, 'dlp-' + creepName, 48, {
            sourceContainer: container.id,
            creep: creepName
          })
        }
      }
    })

    this.metaData.upgradeCreeps = Utils.clearDeadCreeps(this.metaData.upgradeCreeps)

    let upgraders = 0;
    switch(this.metaData.roomName)
    {
      case 'E46S51':
        upgraders = 3;
        break;
      case 'E43S52':
        upgraders = 2;
        break;
      default:
        upgraders = 2;
        break;
    }

    if(this.metaData.upgradeCreeps.length < upgraders && this.kernel.data.roomData[this.metaData.roomName].generalContainers.length > 0)
    {
      let creepName = 'em-u-' + proc.metaData.roomName + '-' + Game.time
      let spawned = false;
      if(this.kernel.data.roomData[this.metaData.roomName].extensions.length < 20 || Game.rooms[this.metaData.roomName].storage.store.energy < 150000)
      {

        spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'worker',
          creepName,
          {}
        )
      }
      else
      {
        spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'upgrader',
          creepName,
          {}
        );
      }

      if(spawned){
        this.metaData.upgradeCreeps.push(creepName)
        this.kernel.addProcess(UpgraderLifetimeProcess, 'ulf-' + creepName, 30, {
          creep: creepName
        })
      }
    }

    if(this.kernel.data.roomData[this.metaData.roomName].storageLink)
    {
      let storageLink = this.kernel.data.roomData[this.metaData.roomName].storageLink

      this.metaData.spinCreeps = Utils.clearDeadCreeps(this.metaData.spinCreeps)

      if(this.metaData.spinCreeps.length < 1 && this.kernel.data.roomData[this.metaData.roomName].sourceLinks.length > 1)
      {
        let creepName = 'em-s-' + proc.metaData.roomName + '-' + Game.time;
        let spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'spinner',
          creepName,
          {}
        );

        if(spawned)
        {
          this.metaData.spinCreeps.push(creepName);
          this.kernel.addProcess(SpinnerLifetimeProcess, 'slf-' + creepName, 45, {
            creep: creepName,
            storageLink: storageLink.id
          })
        }
      }
    }
  }
}
