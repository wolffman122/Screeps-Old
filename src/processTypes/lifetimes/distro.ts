import {LifetimeProcess} from '../../os/process'

import {CollectProcess} from '../creepActions/collect'
import {DeliverProcess} from '../creepActions/deliver'

export class DistroLifetimeProcess extends LifetimeProcess{
  type = 'dlf'

  run(){
    let creep = this.getCreep()

    if(!creep){ return }

    if(_.sum(creep.carry) === 0)
    {
      let sourceContainer = <Container>Game.getObjectById(this.metaData.sourceContainer);

      if(sourceContainer.store.energy > 0)
      {

        this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
          target: this.metaData.sourceContainer,
          creep: creep.name,
          resource: RESOURCE_ENERGY
        })
      }
      else
      {
        let storage = creep.room.storage;

        if(storage.store.energy > 0)
        {
          this.fork(CollectProcess, 'collect-' + creep.name, this.priority -1, {
            target: storage.id,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          })
        }
      }

      return
    }

    // If the creep has been refilled
    let targets = [].concat(
      <never[]>this.kernel.data.roomData[creep.room.name].spawns,
      <never[]>this.kernel.data.roomData[creep.room.name].extensions,
      <never[]>this.kernel.data.roomData[creep.room.name].towers
    )

    let deliverTargets = _.filter(targets, function(target: DeliveryTarget){
      return (target.energy < target.energyCapacity)
    })


    if(deliverTargets.length === 0){
      targets = [].concat(
        <never[]>this.kernel.data.roomData[creep.room.name].labs,
        <never[]>this.kernel.data.roomData[creep.room.name].generalContainers
      )

      deliverTargets = _.filter(targets, function(target: DeliveryTarget){
        if(target.store){
          return (_.sum(target.store) < target.storeCapacity)
        }else{
          return (target.energy < target.energyCapacity)
        }
      })
    }

    if(deliverTargets.length === 0 && creep.room.storage)
    {
      let targets = [].concat(
        <never[]>[creep.room.storage]
      );

      deliverTargets = _.filter(targets, (t) => {
        return (_.sum(t.store))
      })
    }

    let target = creep.pos.findClosestByPath(deliverTargets)

    if(target){
      this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority -1, {
        creep: creep.name,
        target: target.id,
        resource: RESOURCE_ENERGY
      })
    }else{
      this.suspend = 15
      //this.suspend = 5
    }
  }
}
