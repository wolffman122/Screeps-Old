import { Process } from "os/process";

export class MinetalTerminalManagementProcess extends Process
{
  type = 'mineralTerminal';

  run()
  {
    let keepAmount = 35000;
    let spreadAmount = 2000;

    this.log('Minteral Terminal');

    let minerals: Mineral[] = [];
    let recievableRooms: Room[] = [];

    _.forEach(Game.rooms, (r) => {
      if(r.controller.my && r.terminal && r.controller.level >= 7)
      {
        let mineral = <Mineral>r.find(FIND_MINERALS)[0]
        if(mineral)
        {
          if(mineral.room.storage && mineral.room.terminal.store[mineral.mineralType] >= keepAmount)
          {
            //console.log('Room ' + mineral.room.name + ' storage ' + mineral.room.storage.store[mineral.mineralType])
            minerals.push(mineral);
          }
        }

        if(r.terminal && r.terminal.my)
        {
          recievableRooms.push(r);
        }

      }
    });

   _.forEach(minerals, (m) => {
      let sent = false;

      if(m.room.terminal.cooldown === 0)
      {
        _.forEach(recievableRooms, (r) => {

          if(m.room.name != r.name && !sent)
          {
            if(r.terminal && r.terminal.my &&
              r.storage &&
              (r.storage.store[m.mineralType] < spreadAmount || !r.storage.store[m.mineralType]))
            {
              /*if(m.room.terminal.send(m.mineralType, spreadAmount, r.name) === OK)
              {
                sent = true;
              }*/
            }
          }
        })
      }
    })
  }
}
