import {Process} from '../../os/process'

interface HoldMetaData
{
  creep: string
}

export class HoldProcess extends Process
{
  metaData: HoldMetaData;
  type = 'hold';

  run()
  {
    let creep = Game.creeps[this.metaData.creep];

    if(!creep)
    {
      return;
    }

    let controller = <Controller>Game.rooms[creep.pos.roomName].controller;

    if(controller)
    {
      creep.reserveController(controller);
    }
  }
}
