import { Utils } from "../../lib/utils";
import { LifetimeProcess } from "../../os/LifetimeProcess";

import { BuildProcess } from "../creepActions/build";
import { CollectProcess } from "../creepActions/collect";

export class BuilderLifetimeProcess extends LifetimeProcess
{
  public type = "blf";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      const withdrawTarget = Utils.withdrawTarget(creep, this);

      if (withdrawTarget)
      {
        this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
          creep: creep.name,
          target: withdrawTarget.id,
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
    const sites = this.kernel.data.roomData[creep.room.name].constructionSites;

    const towerSites = _.filter(sites, function(site)
    {
      return (site.structureType === STRUCTURE_TOWER);
    });

    const extensionSites = _.filter(sites, function(site)
    {
      return (site.structureType === STRUCTURE_EXTENSION);
    });

    const containerSites = _.filter(sites, function(site)
    {
      return (site.structureType === STRUCTURE_CONTAINER);
    });

    const rampartSites = _.filter(sites, function(site)
    {
      return (site.structureType === STRUCTURE_RAMPART);
    });

    const normalSites = _.filter(sites, function(site)
    {
      return !(
        site.structureType === STRUCTURE_TOWER
        ||
        site.structureType === STRUCTURE_EXTENSION
        ||
        site.structureType === STRUCTURE_RAMPART
        ||
        site.structureType === STRUCTURE_CONTAINER
      );
    });

    let buildNow: ConstructionSite[];
    if (towerSites.length > 0)
    {
      buildNow = towerSites;
    }
    else
    {
      if (extensionSites.length > 0)
      {
        buildNow = extensionSites;
      }
      else
      {
        if (containerSites.length > 0)
        {
          buildNow = containerSites;
        }
        else
        {
          if (rampartSites.length > 0)
          {
            buildNow = rampartSites;
          }
          else
          {
            buildNow = normalSites;
          }
        }
      }
    }

    const target = creep.pos.findClosestByRange(buildNow);

    if (target)
    {
      this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
        creep: creep.name,
        site: target.id
      });

      return;
    }
    else
    {
      creep.say("spare");
    }
  }
}
