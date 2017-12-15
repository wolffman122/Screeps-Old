interface PartList{
  [name: string]: string[]
}

interface WeightList{
  [part: string]: number
}

export const CreepBuilder = {
  design: function(creepType: string, room: Room){
    let body = <string[]>[].concat(<never[]>CreepBuilder.typeStarts[creepType])
    let spendCap

    let creepCount = _.filter(Game.creeps, function(creep){
      return creep.room.name === room.name
    }).length
    let emergancy = (creepType === 'harvester' && creepCount < 2) || (creepType === 'mover' && creepCount < 4)

    console.log('Emergency status ' + emergancy + ' creepType ' + creepType + ' creep count ' + creepCount);
    if(emergancy){
      spendCap = 300
    }else{
      spendCap = room.energyCapacityAvailable
    }

    let add = true
    let extendIndex = 0

    while(add){
      var creepCost = CreepBuilder.bodyCost(body)

      var nextPart = CreepBuilder.typeExtends[creepType][extendIndex]

      if(
        creepCost + BODYPART_COST[nextPart] > spendCap
        ||
        body.length === CreepBuilder.typeLengths[creepType]
      ){
        add = false
      }else{
        body.push(CreepBuilder.typeExtends[creepType][extendIndex])
        extendIndex += 1
        if(extendIndex === CreepBuilder.typeExtends[creepType].length){
          extendIndex = 0
        }
      }
    }

    return _.sortBy(body, function(part){
      return CreepBuilder.partWeight[part]
    })
  },

  bodyCost: function(body: string[]){
    let cost = 0

    for(let part in body){
      cost += BODYPART_COST[body[part]]
    }

    return cost
  },

  partWeight: <WeightList>{
    'attack': 15,
    'carry': 8,
    'claim': 9,
    'heal': 20,
    'move': 5,
    'ranged_attack': 14,
    'tough': 1,
    'work': 10
  },

  typeStarts: <PartList>{
    'claimer': [CLAIM, MOVE],
    'harvester': [WORK, WORK, CARRY, MOVE],
    'hold': [CLAIM, MOVE],
    'mover': [CARRY, MOVE],
    'bigMover': [CARRY, MOVE],
    'worker': [WORK, CARRY, MOVE, MOVE],
    'upgrader': [WORK, CARRY, MOVE],
    'defender': [MOVE,MOVE,MOVE,ATTACK,ATTACK],
    'spinner': [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
    'holdmover': [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,WORK],
    'bigHarvester': [WORK, WORK, CARRY, MOVE, MOVE],
  },

  typeExtends: <PartList>{
    'claimer': [CLAIM],
    'harvester': [MOVE, WORK],
    'hold': [CLAIM, MOVE],
    'mover': [CARRY, CARRY, MOVE],
    'bigMover': [CARRY, CARRY, MOVE],
    //'worker': [WORK, CARRY, MOVE, MOVE]
    'worker': [CARRY, WORK, MOVE, MOVE],
    'upgrader': [CARRY, WORK, MOVE],
    'defender': [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK],
    'spinner': [CARRY],
    'holdmover': [CARRY,CARRY,MOVE],
    'bigHarvester': [WORK, WORK]
  },

  typeLengths: <{[name: string]: number}>{
    'claimer': 2,
    'harvester': 13,
    'hold': 4,
    'mover': 32,
    'bigMover': 42,
    'worker': 16,
    'upgrader': 42,
    'defender': 26,
    'spinner': 14,
    'holdmover': 50,
    'bigHarvester': 15
  }
}
