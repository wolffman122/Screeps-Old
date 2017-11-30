import { Process } from "os/process";


export class LinkManagementProcess extends Process
{
  type = 'lm';

  run()
  {
    if(this.roomData().controllerLink)
    {
      let controllerLink = this.roomData().controllerLink;

      let storageLink = this.roomData().storageLink;

      if(storageLink)
      {
        if(storageLink.cooldown == 0 && storageLink.energy > 700 && controllerLink.energy < 450)
        {
          let ret = storageLink.transferEnergy(controllerLink);
          if(ret == ERR_FULL)
          {
            this.suspend = 15;
          }
        }
        else
        {
          this.suspend = 10;
        }
      }
    }

    if(this.roomData().sourceLinks.length > 0)
    {
      let storageLink = this.roomData().storageLink

      if(storageLink)
      {
        _.forEach(this.roomData().sourceLinks, (sl) => {
          if(sl.cooldown == 0 && sl.energy > 700)
          {
            sl.transferEnergy(storageLink);
          }
        });
      }
    }
  }
}
