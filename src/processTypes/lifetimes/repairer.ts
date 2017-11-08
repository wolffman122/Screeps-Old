import {LifetimeProcess} from '../../os/process'
import {Utils} from '../../lib/utils'

import {CollectProcess} from '../creepActions/collect'
import {RepairProcess} from '../creepActions/repair'
import {BuildProcess} from '../creepActions/build'

export class RepairerLifetimeProcess extends LifetimeProcess{
  type = 'rlf'

  run(){
    let creep = this.getCreep()

    if(!creep){ return }

    if(_.sum(creep.carry) === 0){
      let target = Utils.withdrawTarget(creep, this)

      if(target){
        this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
          creep: creep.name,
          target: target.id,
          resource: RESOURCE_ENERGY
        })

        return
      }else{
        this.suspend = 10
        return
      }
    }

    // If the creep has been refilled
    let repairableObjects = <StructureRoad[]>[].concat(
      <never[]>this.kernel.data.roomData[this.metaData.roomName].containers,
      <never[]>this.kernel.data.roomData[this.metaData.roomName].roads
    )

    let shortestDecay = 100

    let repairTargets = _.filter(repairableObjects, function(object){
      if(object.ticksToDecay < shortestDecay){ shortestDecay = object.ticksToDecay }

      return (object.hits < object.hitsMax)
    })

    if(repairTargets.length > 0){
      let target = creep.pos.findClosestByPath(repairTargets)

      this.fork(RepairProcess, 'repair-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: target.id
      })
    }
    else
    {
      // If the creep has been refilled
        let target = creep.pos.findClosestByRange(this.kernel.data.roomData[creep.room.name].constructionSites)

        if(target)
        {
          this.fork(BuildProcess, 'build-' + creep.name, this.priority - 1, {
            creep: creep.name,
            site: target.id
          })

          return
        }
        else
        {
          this.suspend = shortestDecay;
          return;
        }
    }
  }
}
