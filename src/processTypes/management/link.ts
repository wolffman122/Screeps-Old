import { Process } from "os/process";


export class LinkManagementProcess extends Process
{
  type = 'lm'

  run()
  {
    let room = Game.rooms[this.metaData.roomName];

    if(!room)
    {
      this.completed = true;
      return;
    }

    let sourceLinks = this.roomData().sourceLinks
    let storageLink = this.roomData().storageLinks[0];

    if(!sourceLinks || !storageLink)
    {
      if(storageLink.energy < storageLink.energyCapacity)
      {
        let transferAmount = storageLink.energyCapacity - storageLink.energy;
        _.forEach(sourceLinks, (l) => {
          if(l.cooldown === 0)
          {
            l.transferEnergy(storageLink, transferAmount);
          }

        });
      }
    }
  }
}
