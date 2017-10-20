import { LifetimeProcess } from "../../os/LifetimeProcess";

import { CollectProcess } from "../creepActions/collect";
import { UpgradeProcess } from "../creepActions/upgrade";

export class UpgraderLifetimeProcess extends LifetimeProcess
{
  public type = "ulf";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      const link = _.find(this.kernel.data.roomData[creep.room.name].links, (l: StructureLink) => {
        return l.energy > 0 && l.pos.inRangeTo(creep.room.controller!.pos, 3);
      });

      if (link)
      {
        this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
          target: link.id,
          creep: creep.name,
          resource: RESOURCE_ENERGY
        });

        return;
      }
      else
      {
        let targets = [].concat(
          this.kernel.data.roomData[creep.room.name].generalContainers as never[]
        ) as DeliveryTarget[];

        const capacity = creep.carryCapacity;

        targets = _.filter(targets, (t) =>
        {
          return (t.store.energy > capacity);
        });

        if (targets.length > 0)
        {
          const target = creep.pos.findClosestByPath(targets);

          this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
            target: target.id,
            creep: creep.name,
            resource: RESOURCE_ENERGY
          });

          return;
        }
      }
    }

    // If the creep has been refilled
    this.fork(UpgradeProcess, "upgrade-" + creep.name, this.priority - 1, {
      creep: creep.name
    });
  }
}
