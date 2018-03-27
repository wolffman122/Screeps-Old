import { Process } from "os/process";

export class MinetalTerminalManagementProcess extends Process
{
  type = 'mineralTerminal';

  run()
  {
    let keepAmount = 35000;
    let spreadAmount = 2000;

    this.log('Minteral Terminal');

    let roomsExtraMinerals: {rName: string, mType: string} [] = [];
    let recievableRooms: {rName: string, mType: string, amount: number } [] = [];

    _.forEach(Game.rooms, (r) => {
      if(r.controller.my && r.terminal && r.controller.level >= 8 && r.terminal.cooldown === 0)
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

          let lowest = spreadAmount;
          let roomName = "";
          let type = "";

          for(let mineralType of MINERALS_RAW)
          {
            if(r.terminal.store[mineralType] == undefined || r.terminal.store[mineralType] < lowest && mineralType !== mineral.mineralType)
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

    _.forEach(roomsExtraMinerals, (ex) => {
      console.log('Sending Room ' + ex.rName + ' Min Type ' + ex.mType);
      let receiveRoom = _.find(recievableRooms, (rr) => {
        if(rr.mType == ex.mType && rr.rName != ex.rName)
        {
          return rr.rName;
        }
      });

      if(receiveRoom)
      {
        let terminal = Game.rooms[ex.rName].terminal;
        if(terminal && terminal.cooldown == 0)
        {
          terminal.send(ex.mType, (spreadAmount - receiveRoom.amount), receiveRoom.rName);
          console.log('Terminal ' + ex.rName + ' Send ' + ex.mType + ' Amount ' + (spreadAmount - receiveRoom.amount) + ' Desitination Room ' + receiveRoom.rName);
        }
        else
        {
          console.log('Send Room ' + ex.rName + ' Terminal cool down '  + terminal.cooldown + ' amount ' + (spreadAmount - receiveRoom.amount));
        }
      }
      else
      {
        console.log('Extra min room ' + ex.rName);
      }
    });
  }
}

export const MINERALS_RAW = ["H", "O", "Z", "U", "K", "L", "X"];
