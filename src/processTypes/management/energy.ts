import {Process} from '../../os/process'
import {Utils} from '../../lib/utils'

import {HarvesterLifetimeProcess} from '../lifetimes/harvester'
import {DistroLifetimeProcess} from '../lifetimes/distro'
import {UpgraderLifetimeProcess} from '../lifetimes/upgrader'

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
  }

  run(){
    this.ensureMetaData()

    if(!this.kernel.data.roomData[this.metaData.roomName])
    {
      console.log("Energy Process Done to soon");
      this.completed = true
      return
    }

    console.log("Energy Process Running");
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

      if(workRate < source.energyCapacity / 300){
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

    console.log("Energy Process Running 1 :", this.kernel.data.roomData[this.metaData.roomName].sourceContainers);
    _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, function(container){
      console.log('Inside the for loop', proc.metaData.distroCreeps[container.id])
      if(proc.metaData.distroCreeps[container.id])
      {
        console.log('Inside the for loop 2')
        let creep = Game.creeps[proc.metaData.distroCreeps[container.id]]
        console.log('container 1');
        if(!creep){
          delete proc.metaData.distroCreeps[container.id]
          return
        }
      }
      else
      {
        console.log('container 2');
        let creepName = 'em-m-' + proc.metaData.roomName + '-' + Game.time
        let spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          'mover',
          creepName,
          {}
        )

        if(spawned){
          console.log('container 3');
          proc.metaData.distroCreeps[container.id] = creepName
          proc.kernel.addProcess(DistroLifetimeProcess, 'dlp-' + creepName, 48, {
            sourceContainer: container.id,
            creep: creepName
          })
        }
      }
    })

    console.log("Energy Process Running 2");
    this.metaData.upgradeCreeps = Utils.clearDeadCreeps(this.metaData.upgradeCreeps)

    if(this.metaData.upgradeCreeps.length < 2 && this.kernel.data.roomData[this.metaData.roomName].generalContainers.length > 0){
      let creepName = 'em-u-' + proc.metaData.roomName + '-' + Game.time
      let spawned = Utils.spawn(
        proc.kernel,
        proc.metaData.roomName,
        'worker',
        creepName,
        {}
      )

      if(spawned){
        this.metaData.upgradeCreeps.push(creepName)
        this.kernel.addProcess(UpgraderLifetimeProcess, 'ulf-' + creepName, 30, {
          creep: creepName
        })
      }
    }
  }
}
