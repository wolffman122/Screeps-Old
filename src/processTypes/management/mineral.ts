import { Process } from "os/process";
import { Utils } from "lib/utils";
import { MineralHarvesterLifetimeProcess } from "processTypes/lifetimes/mineralHarvester";
import { MineralDistroLifetimeProcess } from "processTypes/lifetimes/mineralDistro";

export class MineralManagementProcess extends Process
{
  type = 'minerals';

  run()
  {
    this.log('Mineral running');
    if(!this.kernel.data.roomData[this.metaData.roomName])
    {
      this.completed = true;
      return;
    }

    let proc = this;
    let extractor = this.kernel.data.roomData[this.metaData.roomName].extractor;
    let mineral = this.kernel.data.roomData[this.metaData.roomName].mineral;
    let container = this.kernel.data.roomData[this.metaData.roomName].mineralContainer;

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
        proc.metaData.roomName,
        'harvester',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.mineralHarvesters.push(creepName)
        this.kernel.addProcess(MineralHarvesterLifetimeProcess, 'mhlf-' + creepName, 25, {
          creep: creepName
        });
      }
    }

    if(this.metaData.mineralHarvesters.length > 0 && this.metaData.mineralHaulers.length < 1)
    {
      let creepName = 'min-m-' + proc.metaData.roomName + '-' + Game.time;
      let spawned = Utils.spawn(
        proc.kernel,
        proc.metaData.roomName,
        'mover',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.mineralHaulers.push(creepName);
        this.kernel.addProcess(MineralDistroLifetimeProcess, 'mdlf-' + creepName, 22, {
          creep: creepName,
          container: container.id,
          mineralType: mineral.mineralType
        })
      }
    }
  }
}
