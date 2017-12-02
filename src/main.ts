
//global.SCRIPT_VERSION = require('./version')
import "./lib/Traveler"
import {Kernel} from './os/kernel'


Creep.prototype.fixMyRoad = function()
{
  if(this.carry.energy === 0)
  {
    return false;
  }

  let repairPower = this.getActiveBodyparts(WORK) * REPAIR_POWER;

  if(repairPower === 0)
  {
    return false;
  }

  var road = this.pos.lookFor(LOOK_STRUCTURES).find(s => s.structureType === STRUCTURE_ROAD);

  if(!road)
  {
    return false;
  }

  var toFix = road.hitsMax - road.hits;
  this.repair(road);

  return toFix - repairPower > repairPower;
}

module.exports.loop = function(){
  // Load Memory from the global object if it is there and up to date.
  if(global.lastTick && global.LastMemory && Game.time === (global.lastTick + 1)){
    delete global.Memory
    global.Memory = global.LastMemory
    RawMemory._parsed = global.LastMemory
  }else{
    Memory;
    global.LastMemory = RawMemory._parsed
    global.roomData = {}
  }
  global.lastTick = Game.time

  // Create a new Kernel
  let kernel = new Kernel

  console.log('Start Kernel run process');
  // While the kernel is under the CPU limit
  while(kernel.underLimit() && kernel.needsToRun()){
    kernel.runProcess()
  }

  // Tear down the OS
  kernel.teardown()
}
