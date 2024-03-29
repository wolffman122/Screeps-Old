import {Process} from '../../os/process'

interface MoveMetaData{
  creep: string
  pos: {
    x: number
    y: number
    roomName: string
  }
  range: number
}

export class MoveProcess extends Process{
  metaData: MoveMetaData
  type = 'move'

  run(){

    let creep = Game.creeps[this.metaData.creep]

    if(!creep || !this.metaData.pos){
      this.completed = true
      this.resumeParent()
      return
    }

    let target = new RoomPosition(this.metaData.pos.x, this.metaData.pos.y, this.metaData.pos.roomName)

    if(creep.fatigue == 0){
      if(creep.pos.inRangeTo(target, this.metaData.range)){
        this.completed = true
        this.resumeParent()
      }else
      {
        if(!creep.fixMyRoad())
        {
          creep.travelTo(target)
        }
      }
    }else{
      let decreasePerTick = 0
      _.forEach(creep.body, function(part){
        if(part.type === MOVE){
          decreasePerTick += 2
        }
      })

      let ticks = Math.ceil(creep.fatigue / decreasePerTick)

      this.suspend = ticks
    }
  }
}
