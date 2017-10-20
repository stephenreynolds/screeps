import { LifetimeProcess } from "../../os/LifetimeProcess";

import { BuildProcess } from "../creepActions/build";
import { DeliverProcess } from "../creepActions/deliver";
import { HarvestProcess } from "../creepActions/harvest";
import { UpgradeProcess } from "../creepActions/upgrade";

export class HarvesterLifetimeProcess extends LifetimeProcess
{
  public type = "hlf";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      this.fork(HarvestProcess, "harvest-" + creep.name, this.priority - 1, {
        source: this.metaData.source,
        creep: creep.name
      });

      return;
    }

    // Creep has been harvesting and has energy in it
    const source = Game.getObjectById(this.metaData.source) as Source;
    const constructionSites = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1) as ConstructionSite[];
    if (constructionSites.length > 0)
    {
      this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
        creep: creep.name,
        site: constructionSites[0].id
      });

      return;
    }

    if (this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source])
    {
      const container = this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source];

      if (_.sum(container.store) < container.storeCapacity)
      {
        this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
          target: container.id,
          creep: creep.name,
          resource: RESOURCE_ENERGY
        });

        return;
      }
    }

    // Source Container does not exist OR source container is full
    let deliverTargets;

    const targets = [].concat(
      this.kernel.data.roomData[creep.room.name].spawns as never[],
      this.kernel.data.roomData[creep.room.name].extensions as never[]
    );

    deliverTargets = _.filter(targets, function(t: DeliveryTarget)
    {
      return (t.energy < t.energyCapacity);
    });

    if (creep.room.storage && deliverTargets.length === 0)
    {
      const targs = [].concat(
        [creep.room.storage] as never[]
      );

      deliverTargets = _.filter(targs, function(t: DeliveryTarget)
      {
        return (_.sum(t.store) < t.storeCapacity);
      });
    }

    if (
      deliverTargets.length === 0
      ||
      (
        this.kernel.data.roomData[creep.room.name].generalContainers.length === 0
        &&
        !creep.room.storage
        &&
        this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source]
        &&
        this.kernel.getProcessByName("em-" + creep.room.name).metaData.distroCreeps[
          this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source].id]
      )
    )
    {
      // If there is no where to deliver to
      this.kernel.addProcess(UpgradeProcess, creep.name + "-upgrade", this.priority, {
        creep: creep.name
      });

      this.suspend = creep.name + "-upgrade";
      return;
    }

    // Find the nearest target
    const target = creep.pos.findClosestByPath(deliverTargets) as Structure;

    this.fork(DeliverProcess, creep.name + "-deliver", this.priority, {
      creep: creep.name,
      target: target.id,
      resource: RESOURCE_ENERGY
    });
  }
}
