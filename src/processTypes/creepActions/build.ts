import {Process} from '../../os/process'

interface BuildProcessMetaData{
  creep: string
  site: string
}

export class BuildProcess extends Process{
  metaData: BuildProcessMetaData
  type = 'build'

  run(){
    let creep = Game.creeps[this.metaData.creep]
    let site = <ConstructionSite>Game.getObjectById(this.metaData.site)

    if(creep && !site){
      Memory.rooms[creep.room.name] = {}
    }

    if(!site || !creep || _.sum(creep.carry) === 0){
      this.completed = true
      this.resumeParent()
      return
    }

    if(!creep.pos.inRangeTo(site, 3)){
      creep.travelTo(site);
    }else{
      creep.build(site)
    }
  }
}
