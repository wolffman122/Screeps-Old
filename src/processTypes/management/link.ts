import { Process } from "os/process";


export class LinkManagementProcess extends Process
{
  type = 'lm';

  run()
  {
    if(this.roomData().sourceLinks.length > 0)
    {
      let storageLink = this.roomData().storageLink

      if(storageLink)
      {
        _.forEach(this.roomData().sourceLinks, (sl) => {
          if(sl.cooldown == 0 && sl.energy > 0)
          {
            sl.transferEnergy(storageLink);
          }
        });
      }
    }
  }
}
