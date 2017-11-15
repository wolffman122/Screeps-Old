import {Process} from '../../os/process'
import { Utils } from 'lib/utils';
import { DeliverProcess } from '../creepActions/deliver';
import {CollectProcess} from '../creepActions/collect';

interface TransferProcessMetaData
{
  creep: string
  sourceRoom: string
  destinationRoom: string

}
export class TransferProcess extends Process
{
  metaData: TransferProcessMetaData;
  type = 'transfer';

  run()
  {
    let creep = Game.creeps[this.metaData.creep];

    if(!creep)
    {
      let creepName = 'transfer-' + this.metaData.destinationRoom + '-' + Game.time;
      let spawned = Utils.spawn(
        this.kernel,
        this.metaData.sourceRoom,
        'mover',
        creepName,
        {}
      );

      if(spawned)
      {
        this.metaData.creep = creepName;
      }

      return;
    }

    if(_.sum(creep.carry) === 0)
    {
      let storage = Game.rooms[this.metaData.sourceRoom].storage;
      if(storage)
      {
        if(storage.store.energy > 0)
        {
          this.fork(CollectProcess, 'collect-' + creep.name, this.priority - 1, {
            target: storage.id,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          });
        }
      }
      else
      {
        this.log("Storage source bad");
      }

      return;
    }

    let deliveryStorage = Game.rooms[this.metaData.destinationRoom].storage;

    if(deliveryStorage)
    {
      this.fork(DeliverProcess, 'deliver-' + creep.name, this.priority - 1, {
        creep: creep.name,
        target: deliveryStorage.id,
        resource: RESOURCE_ENERGY
      });
    }
    else
    {
      this.log("Storage destination bad");
    }


  }
}
