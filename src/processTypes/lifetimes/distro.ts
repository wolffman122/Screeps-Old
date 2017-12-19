import {LifetimeProcess} from '../../os/process'

import {CollectProcess} from '../creepActions/collect'

export class DistroLifetimeProcess extends LifetimeProcess{
  type = 'dlf'

  run(){
    let creep = this.getCreep()

    if(!creep){ return }

    if(_.sum(creep.carry) === 0 && creep.ticksToLive > 50)
    {
      if(creep.memory.storageDelivery == true)
      {
        creep.memory.storageDelivery = false;
        this.suspend = 5;
        return;
      }

      if(this.kernel.data.roomData[creep.pos.roomName].sourceLinks.length == 2)
      {
        let sourceContainer = <Container>Game.getObjectById(this.metaData.sourceContainer);

        if(sourceContainer.store.energy > creep.carryCapacity)
        {
          this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
            target: this.metaData.sourceContainer,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          });

          return;
        }

        let storage = creep.room.storage;

        if(storage.store.energy > 0)
        {
          this.log('Go get from storage .........')
          this.fork(CollectProcess, 'collect-' + creep.name, this.priority -1, {
            target: storage.id,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          })

          return;
        }
      }
      else
      {
        let sourceContainer = <Container>Game.getObjectById(this.metaData.sourceContainer);

        if(sourceContainer.store.energy >= creep.carryCapacity)
        {

          this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
            target: this.metaData.sourceContainer,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          })

          return;
        }
        else
        {
          let storage = creep.room.storage;

          if(storage.store.energy > creep.carryCapacity)
          {
            this.fork(CollectProcess, 'collect-' + creep.name, this.priority -1, {
              target: storage.id,
              creep: creep.name,
              resource: RESOURCE_ENERGY
            })

            return;
          }
        }

      }
    }

    // If the creep has been refilled
    let targets = [].concat(
      <never[]>this.kernel.data.roomData[creep.room.name].spawns,
      <never[]>this.kernel.data.roomData[creep.room.name].extensions,
      <never[]>this.kernel.data.roomData[creep.room.name].towers
    )

    let deliverTargets = _.filter(targets, function(target: DeliveryTarget){
      if(target.structureType == STRUCTURE_TOWER)
      {
        return (target.energy < target.energyCapacity * .80)
      }
      else
      {
        return (target.energy < target.energyCapacity)
      }
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
        return (t.structureType == STRUCTURE_STORAGE)
      })
    }

    let target = creep.pos.findClosestByPath(deliverTargets)

    if(target){
      if(!creep.pos.inRangeTo(target, 1))
      {
        if(!creep.fixMyRoad())
        {
          creep.travelTo(target);
        }
      }

      if(target.structureType == STRUCTURE_STORAGE)
      {
        creep.memory.storageDelivery = true;
      }
      else
      {
        creep.memory.storageDelivery = false;
      }

      if(creep.transfer(target, (this.metaData.resource || RESOURCE_ENERGY)) == ERR_FULL)
      {
        return;
      }
    }else{
      //this.suspend = 15
      this.suspend = 5
    }

    if(creep.ticksToLive < 60 && _.sum(creep.carry) > 0)
    {
      if(creep.room.storage)
      {
        let target = creep.room.storage;

        if(!creep.pos.inRangeTo(target, 1))
        {
          if(!creep.fixMyRoad())
          {
            creep.travelTo(target);
          }
        }

        if(creep.transfer(target, (this.metaData.resource || RESOURCE_ENERGY)) == ERR_FULL)
        {
          return;
        }
      }
    }
  }
}
