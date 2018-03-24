import { Process } from "os/process";

export class MinetalTerminalManagementProcess extends Process
{
  type = 'mineralTerminal';

  run()
  {
    let keepAmount = 35000;
    //let spreadAmount = 2000;

    this.log('Minteral Terminal');

    let roomsExtraMinerals: {rName: string, mType: string} [] = [];
    let recievableRooms: {rName: string, mType: string, amount: number } [] = [];

    _.forEach(Game.rooms, (r) => {
      if(r.controller.my && r.terminal && r.controller.level >= 7)
      {
        let mineral = <Mineral>r.find(FIND_MINERALS)[0]
        if(mineral)
        {
          if(mineral.room.storage && mineral.room.terminal.store[mineral.mineralType] >= keepAmount)
          {
            //console.log('Room ' + mineral.room.name + ' storage ' + mineral.room.storage.store[mineral.mineralType])
            roomsExtraMinerals.push( {
              rName: mineral.room.name,
              mType: mineral.mineralType
            })
          }

          let lowest = r.terminal.storeCapacity;
          let roomName = "";
          let type = "";

          for(let mineralType of MINERALS_RAW)
          {
            if(r.name == 'E46S51')
            {
             console.log('Min Type ' + mineralType + ' Term Amount ' + r.terminal.store[mineralType] + ' Room Min ' + mineral.mineralType);
            }
            if((r.terminal.store[mineralType] == undefined || r.terminal.store[mineralType] < lowest && mineralType)!= mineral.mineralType)
            {
              if(r.terminal.store[mineralType] == undefined)
              {
                lowest = 0;
              }
              else
              {
                lowest = r.terminal.store[mineralType];
              }
              roomName = r.name;
              type = mineralType;
            }
          }

          if(roomName !== "" && type !== "")
          {
            recievableRooms.push ({
              rName: roomName,
              mType: type,
              amount: lowest
            })
          }
        }
      }
    });

    this.log('Extra Minerals');
    _.forEach(roomsExtraMinerals, (r) => {
      console.log('Name ' + r.rName + " Mineral Type " + r.mType);
    })

    this.log('Receivable Rooms');
    _.forEach(recievableRooms, (r) => {
      console.log('Room ' + r.rName + ' Type ' + r.mType + ' Amount ' + r.amount);
    })
  }
}

export const MINERALS_RAW = ["H", "O", "Z", "U", "K", "L", "X"];
