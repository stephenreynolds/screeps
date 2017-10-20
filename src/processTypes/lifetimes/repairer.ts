import { Utils } from "../../lib/utils";
import { LifetimeProcess } from "../../os/LifetimeProcess";

import { CollectProcess } from "../creepActions/collect";
import { RepairProcess } from "../creepActions/repair";

export class RepairerLifetimeProcess extends LifetimeProcess
{
  public type = "rlf";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      const target = Utils.withdrawTarget(creep, this);

      if (target)
      {
        this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
          creep: creep.name,
          target: target.id,
          resource: RESOURCE_ENERGY
        });

        return;
      }
      else
      {
        this.suspend = 10;
        return;
      }
    }

    // If the creep has been refilled
    let repairableObjects = [].concat(
      this.kernel.data.roomData[this.metaData.roomName].containers as never[],
      this.roomData().ramparts as never[]
    ) as StructureRoad[];

    let shortestDecay = 100;

    const proc = this;

    let repairTargets = _.filter(repairableObjects, function(object)
    {
      if (object.ticksToDecay < shortestDecay) { shortestDecay = object.ticksToDecay; }

      if (object.structureType !== STRUCTURE_RAMPART)
      {
        return (object.hits < object.hitsMax);
      }
      else
      {
        return (object.hits < Utils.rampartHealth(proc.kernel, proc.metaData.roomName));
      }
    });

    if (repairTargets.length === 0)
    {
      repairableObjects = [].concat(
        this.kernel.data.roomData[this.metaData.roomName].roads as never[]
      ) as StructureRoad[];

      shortestDecay = 100;

      repairTargets = _.filter(repairableObjects, function(object)
      {
        if (object.ticksToDecay < shortestDecay)
        {
          shortestDecay = object.ticksToDecay;
        }

        if (object.structureType !== STRUCTURE_RAMPART)
        {
          return (object.hits < object.hitsMax);
        }
        else
        {
          return (object.hits < Utils.rampartHealth(proc.kernel, proc.metaData.roomName));
        }
      });
    }

    if (repairTargets.length > 0)
    {
      const target = creep.pos.findClosestByPath(repairTargets);

      this.fork(RepairProcess, "repair-" + creep.name, this.priority - 1, {
        creep: creep.name,
        target: target.id
      });
    }
    else
    {
      this.suspend = shortestDecay;
      return;
    }
  }
}
