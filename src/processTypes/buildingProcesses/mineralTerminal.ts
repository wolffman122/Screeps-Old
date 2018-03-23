import { Process } from "os/process";

export class MinetalTerminalManagementProcess extends Process
{
  type = 'mineralTerminal';

  run()
  {
    let keepAmount = 35000;
    let spreadAmount = 2000;

    this.log('Minteral Terminal');

    let roomsExtraMinerals: Room[] = [];
    let recievableRooms: { [name: string]: string[]; } = {};

    _.forEach(Game.rooms, (r) => {
      if(r.controller.my && r.terminal && r.controller.level >= 7)
      {
        let mineral = <Mineral>r.find(FIND_MINERALS)[0]
        if(mineral)
        {
          if(mineral.room.storage && mineral.room.terminal.store[mineral.mineralType] >= keepAmount)
          {
            //console.log('Room ' + mineral.room.name + ' storage ' + mineral.room.storage.store[mineral.mineralType])
            roomsExtraMinerals.push(mineral.room);
          }

          let lowest = r.terminal.storeCapacity;
          let roomName = "";
          for(let mineralType of MINERALS_RAW)
          {
            if(r.terminal.store[mineralType] < lowest && mineralType != mineral.mineralType)
            {
              lowest = r.terminal.store[mineralType];
              roomName = r.name;
            }
          }
        }
      }
    });

   _.forEach(roomsExtraMinerals, (m) => {
      let sent = false;

      if(m.terminal.cooldown === 0)
      {
        let mineral = <Mineral>r.find(FIND_MINERALS)[0];

        _.find(recievableRooms, (rr) => {

        })
      }
    })
  }
}

export const MINERALS_RAW = ["H", "O", "Z", "U", "K", "L", "X"];
