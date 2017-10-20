import { LifetimeProcess } from "../../os/LifetimeProcess";

import { CollectProcess } from "../creepActions/collect";
import { DeliverProcess } from "../creepActions/deliver";

export class DistroLifetimeProcess extends LifetimeProcess
{
  public type = "dlf";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    const container = Game.getObjectById(this.metaData.sourceContainer) as StructureContainer;
    if (!container)
    {
      this.completed = true;
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
        target: this.metaData.sourceContainer,
        creep: creep.name,
        resource: RESOURCE_ENERGY
      });

      return;
    }

    // If the creep has been refilled
    const sourceContainer = Game.getObjectById(this.metaData.sourceContainer) as Structure;
    if (sourceContainer.structureType !== STRUCTURE_STORAGE && creep.room.storage)
    {
      if (this.kernel.getProcessByName("em-" + creep.room.name).metaData.distroCreeps[creep.room.storage!.id])
      {
        if (_.sum(creep.room.storage!.store) < creep.room.storage!.storeCapacity)
        {
          this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
            creep: creep.name,
            target: creep.room.storage!.id,
            resource: RESOURCE_ENERGY
          });

          return;
        }
      }
    }

    let targets = [].concat(
      this.kernel.data.roomData[creep.room.name].spawns as never[],
      this.kernel.data.roomData[creep.room.name].extensions as never[]
    );

    let deliverTargets = _.filter(targets, function(t: DeliveryTarget)
    {
      return (t.energy < t.energyCapacity);
    });

    if (deliverTargets.length === 0)
    {
      const targs = [].concat(
        this.kernel.data.roomData[creep.room.name].towers as never[]
      );

      deliverTargets = _.filter(targs, function(t: DeliveryTarget)
      {
        return (t.energy < t.energyCapacity - 250);
      });
    }

    if (deliverTargets.length === 0)
    {
      targets = [].concat(
        this.kernel.data.roomData[creep.room.name].labs as never[],
        this.kernel.data.roomData[creep.room.name].generalContainers as never[]
      );

      deliverTargets = _.filter(targets, function(t: DeliveryTarget)
      {
        if (t.store)
        {
          return (_.sum(t.store) < t.storeCapacity);
        }
        else
        {
          return (t.energy < t.energyCapacity);
        }
      });
    }

    const target = creep.pos.findClosestByPath(deliverTargets);

    if (target)
    {
      this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
        creep: creep.name,
        target: target.id,
        resource: RESOURCE_ENERGY
      });
    }
    else
    {
      this.suspend = 10;
    }
  }
}
