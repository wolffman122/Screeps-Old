import {Process} from '../../os/process'

export class DeliverProcess extends Process{
  metaData: DeliverProcessMetaData
  type = 'deliver'

  run(){
    let creep = Game.creeps[this.metaData.creep]
    let target = <Structure>Game.getObjectById(this.metaData.target)


    if(!target || !creep || _.sum(creep.carry) === 0){
      this.completed = true
      this.resumeParent()
      return
    }

    if(!creep.pos.inRangeTo(target, 1))
    {
      if(!creep.fixMyRoad())
      {
        creep.travelTo(target);
      }
    }

    if(creep.transfer(target, (this.metaData.resource || RESOURCE_ENERGY)) == ERR_FULL)
    {
      this.completed = true
      this.resumeParent()
    }
  }
}
