import { Process } from "os/process";
import { MINERALS_RAW, PRODUCT_LIST, REAGENT_LIST, PRODUCTION_AMOUNT } from "processTypes/buildingProcesses/mineralTerminal"

export class LabManagementProcess extends Process
{
  type = 'labm';
  metaData: LabManagementProcessMetaData;


  reagentLabs: StructureLab[];
  productLabs: StructureLab[];
  terminal: StructureTerminal;
  storage: StructureStorage;
  labProcess: LabProcess;
  room: Room;

  run()
  {
    this.room = Game.rooms[this.metaData.roomName];
    this.terminal = this.room.terminal;
    this.storage = this.room.storage;

    this.reagentLabs = this.findReagentLabs();
    this.productLabs = this.findProductLabs();

    this.labProcess = this.findLabProcess();

    this.log('Lab Work');

    console.log("Lab Process", this.labProcess.)


  }

  private findReagentLabs(): StructureLab[]
  {
    if(this.metaData.reagentLabIds)
    {
      let labs = _.map(this.metaData.reagentLabIds, (id: string) => {
        let lab = Game.getObjectById(id);

        if(lab)
        {
          return lab;
        }
        else
        {
          this.metaData.reagentLabIds = undefined;
        }
      }) as StructureLab[];

      if(labs.length == 2)
      {
        return labs;
      }
      else
      {
        this.metaData.reagentLabIds = undefined;
      }
    }

    if(Game.time % 1000 !== 2)
    {
      return; // early
    }

    if(this.roomData().labs.length < 3)
    {
      this.log('Not enough labs failed');
      return; // early
    }

    let reagentLabs = [];
    for(let lab of this.roomData().labs)
    {
      if(reagentLabs.length === 2)
      {
        break;
      }
      let outOfRange = false;
      for(let otherLab of this.roomData().labs)
      {
        if(lab.pos.inRangeTo(otherLab, 2))
          continue;

        outOfRange = true;
        break;
      }

      if(!outOfRange)
      {
        reagentLabs.push(lab);
      }
    }

    if(reagentLabs.length === 2)
    {
      this.metaData.reagentLabIds = _.map(reagentLabs, (lab: StructureLab) => lab.id);
      this.metaData.productLabIds = undefined;
      return reagentLabs;
    }
  }

  private findProductLabs(): StructureLab[]
  {
    if(this.metaData.productLabIds)
    {
      let labs = this.roomData().labs

      if(labs.length > 0)
      {
        return labs;
      }
      else
      {
        this.metaData.productLabIds = undefined;
      }
    }

    let labs = this.roomData().labs;

    if(labs.length === 0)
    {
      return; // early
    }

    if(this.reagentLabs)
    {
      for(let reagentLab of this.reagentLabs)
      {
        labs = _.pull(labs, reagentLab);
      }
    }

    this.metaData.productLabIds = _.map(labs, (lab: StructureLab) => lab.id);
    return labs;
  }

  private findLabProcess(): LabProcess
  {
    if(!this.reagentLabs)
      return;

    if(this.metaData.labProcess)
    {
      let process = this.metaData.labProcess;
      let processFinished = this.checkProcessFinished(process);
      if(processFinished)
      {
        console.log("Reaction process has finished with", process.currentShortage.mineralType);
        this.metaData.labProcess = undefined;
        return this.findLabProcess();
      }
      let progress = this.checkProgress(process);
      if(!progress)
      {
        console.log(this.name, "made no progress with", process.currentShortage.mineralType);
        this.metaData.labProcess = undefined;
        return this.findLabProcess();
      }
      return process;
    }

    // avoid checking for new process every tick
    if(!this.metaData.checkProcessTick)
    {
      this.metaData.checkProcessTick = Game.time - 100;
    }

    if(Game.time < this.metaData.checkProcessTick + 100)
    {
      return; // early
    }

    this.metaData.labProcess = this.findNewProcess();
  }

  private checkProcessFinished(process: LabProcess)
  {
    for(let i = 0; i < 2; i++)
    {
      let amountInLab = this.reagentLabs[i].mineralAmount;
      let load = process.reagentLoads[Object.keys(process.reagentLoads)[i]];
      if(amountInLab === 0 && load === 0)
      {
        return true;
      }
    }

    return false;
  }

  private checkProgress(process: LabProcess)
  {
    if(Game.time % 1000 !== 2)
    {
      return true;
    }

    let loadStatus = 0;

    for(let resourceType in process.reagentLoads)
    {
      loadStatus += process.reagentLoads[resourceType];
    }

    if(loadStatus !== process.loadProgress)
    {
      process.loadProgress = loadStatus;
      return true;
    }
    else
    {
      return false;
    }
  }

  private findNewProcess(): LabProcess
  {
    let store = this.gatherInventory()

    for(let compound of PRODUCT_LIST)
    {
      if(store[compound] >= PRODUCTION_AMOUNT)
        continue;

      return this.generateProcess( {mineralType: compound, amount: PRODUCTION_AMOUNT - (this.terminal.store[compound] || 0) });
    }
  }

  private gatherInventory(): {[key: string]: number}
  {
    let inventory: {[key: string]: number} = {};
    for(let mineralType in this.terminal.store)
    {
      if(!this.terminal.store.hasOwnProperty(mineralType))
        continue;

      if(inventory[mineralType] === undefined)
        inventory[mineralType] = 0;

      inventory[mineralType] += this.terminal.store[mineralType];
    }

    for(let lab of this.productLabs)
    {
      if(lab.mineralAmount > 0)
      {
        if(inventory[lab.mineralType] === undefined)
          inventory[lab.mineralType] = 0;

        inventory[lab.mineralType] += lab.mineralAmount;
      }
    }

    return inventory;
  }

  private generateProcess(targetShortage: Shortage): LabProcess
  {
    let currentShortage = this.recursiveShortageCheck(targetShortage, true);
    if(currentShortage === undefined)
    {
      console.log("Reaction lab error finding current shortage in", this.name);
      return;
    }

    let reagentLoads = {};
    for(let mineralType of REAGENT_LIST[currentShortage.mineralType])
    {
      reagentLoads[mineralType] = currentShortage.amount;
    }

    let loadProgress = currentShortage.amount * 2;

    return {
      targetShortage: targetShortage,
      currentShortage: currentShortage,
      reagentLoads: reagentLoads,
      loadProgress: loadProgress
    };
  }

  private recursiveShortageCheck(shortage: Shortage, fullAmount = false): Shortage
  {
    // gather amounts of compounds in terminal and labs
    let store = this.gatherInventory();

    if(store[shortage.mineralType] === undefined)
    {
      store[shortage.mineralType] = 0;
    }

    let amountNeeded = shortage.amount - Math.floor(store[shortage.mineralType] / 10) * 10;
    if(fullAmount)
    {
      amountNeeded = shortage.amount;
    }
    if(amountNeeded > 0)
    {
      // remove raw minerals form list, no need to make those
      let reagents = _.filter(REAGENT_LIST[shortage.mineralType], (mineralType: string) => !_.include(MINERALS_RAW, mineralType));
      let shortageFound;
      for(let reagent of reagents)
      {
        shortageFound = this.recursiveShortageCheck({mineralType: reagent, amount: amountNeeded});
        if(shortageFound)
        {
          break;
        }
      }

      if(shortageFound)
      {
        return shortageFound;
      }
      else
      {
        return {mineralType: shortage.mineralType, amount: amountNeeded };
      }
    }
  }
}
