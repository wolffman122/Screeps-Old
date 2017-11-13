import {Process} from '../../os/process'

export class TowerRepairProcess extends Process
{
  type = 'tr';

  run()
  {
    let room = Game.rooms[this.metaData.roomName];
    let structures = <Structure[]>room.find(FIND_STRUCTURES);

    let repairStructures = <Structure[]> _.filter(structures, (s) => {
      return (s.structureType == STRUCTURE_RAMPART && s.hits < 60000)
             ||
             (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.8);
    });

    if(repairStructures.length > 0)
    {
      _.forEach(this.kernel.data.roomData[this.metaData.roomName].towers, (t) => {
        let target = t.pos.findClosestByRange(repairStructures);

        t.repair(target);
      })
    }
    else
    {
      this.completed = true;
    }
  }
}
