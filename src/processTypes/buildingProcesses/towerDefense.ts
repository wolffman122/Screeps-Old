import {Process} from '../../os/process'

export class TowerDefenseProcess extends Process{
  type = 'td'

  run(){
    let room = Game.rooms[this.metaData.roomName]
    let enemies = <Creep[]>room.find(FIND_HOSTILE_CREEPS)

    if(enemies.length > 0){
      _.forEach(this.kernel.data.roomData[this.metaData.roomName].towers, function(tower){
        let rangedEnemies = tower.pos.findInRange(enemies,20)
        if(rangedEnemies.length > 0)
        {
          tower.attack(rangedEnemies[0]);
        }
      })
    }else{
      this.completed = true
    }
  }
}
