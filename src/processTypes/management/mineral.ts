import { Process } from "os/process";
//import { Utils } from "lib/utils";

export class MineralManagementProcess extends Process
{
  /*run()
  {
    if(!this.kernel.data.roomData[this.metaData.roomName])
    {
      this.completed = true;
      return;
    }

    let proc = this;
    let extractor = this.kernel.data.roomData[this.metaData.roomName].extractor;
    let mineral = this.kernel.data.roomData[this.metaData.roomName].mineral;

    if(!mineral || !extractor)
    {
      this.completed = true;
      return;
    }

    this.metaData.mineralHarvesters = Utils.clearDeadCreeps(this.metaData.mineralHarvesters);

    if(this.metaData.mineralHarvesters.lenth < 1) // Need to find a way of how many creeps can mine a mineral
    {
      let creepName = 'min-h-' + proc.metaData.roomName + '-' + Game.time;
      let spawned = Utils.spawn(
        proc.kernel,
        porc.metaData.roomn,
        'harvester',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.mineralHarvesters.push(creepName)
        this.kernel.addProcess(MineralHarvesterLifetimeProcess, 'mhlf-' + creep.name, 25, {
          creep: creepName
        });
      }
    }
  }*/
}
