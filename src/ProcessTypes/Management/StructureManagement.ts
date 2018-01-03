import { Process } from "../../OS/Process";
import { Utils } from "../../Utils/Utils";

import { BuilderLifetimeProcess } from "../Lifetimes/Builder";
import { RepairerLifetimeProcess } from "../Lifetimes/Repairer";

interface StructureManagementProcessMetaData
{
  roomName: string;
  spareCreeps: string[];
  buildCreeps: string[];
  repairCreeps: string[];
}

export class StructureManagementProcess extends Process
{
  public metaData: StructureManagementProcessMetaData;
  public type = "sm";

  public ensureMetaData()
  {
    if (!this.metaData.spareCreeps)
    {
      this.metaData.spareCreeps = [];
    }

    if (!this.metaData.buildCreeps)
    {
      this.metaData.buildCreeps = [];
    }

    if (!this.metaData.repairCreeps)
    {
      this.metaData.repairCreeps = [];
    }
  }

  public run()
  {
    this.ensureMetaData();

    if (!this.kernel.data.roomData[this.metaData.roomName])
    {
      this.completed = true;
      return;
    }

    if (this.room().energyAvailable < 300)
    {
      return;
    }

    const numBuilders = _.min([
      Math.ceil(this.kernel.data.roomData[this.metaData.roomName].constructionSites.length / 10),
      3,
      this.kernel.data.roomData[this.metaData.roomName].constructionSites.length,
      this.room().controller!.level - 1
    ]);

    this.metaData.buildCreeps = Utils.clearDeadCreeps(this.metaData.buildCreeps);
    this.metaData.repairCreeps = Utils.clearDeadCreeps(this.metaData.repairCreeps);
    this.metaData.spareCreeps = Utils.clearDeadCreeps(this.metaData.spareCreeps);

    if (this.metaData.buildCreeps.length < numBuilders)
    {
      if (this.metaData.spareCreeps.length === 0)
      {
        const creepName = "sm-" + this.metaData.roomName + "-" + Game.time;
        const spawned = Utils.spawn(this.kernel, this.metaData.roomName, "worker", creepName, {});
        if (spawned)
        {
          this.metaData.buildCreeps.push(creepName);
          this.kernel.addProcess(BuilderLifetimeProcess, "blf-" + creepName, 30, {
            creep: creepName
          });
        }
      }
      else
      {
        const creepName = this.metaData.spareCreeps.pop() as string;
        this.metaData.buildCreeps.push(creepName);
        this.kernel.addProcess(BuilderLifetimeProcess, "blf-" + creepName, 30, {
          creep: creepName
        });
      }
    }

    const repairableObjects = [].concat(
      this.kernel.data.roomData[this.metaData.roomName].containers as never[],
      this.kernel.data.roomData[this.metaData.roomName].roads as never[]
    ) as Structure[];

    const repairTargets = _.filter(repairableObjects, (object) =>
    {
      return (object.hits < object.hitsMax);
    });

    if (repairTargets.length > 0)
    {
      if (this.metaData.repairCreeps.length === 0)
      {
        if (this.metaData.spareCreeps.length === 0)
        {
          const creepName = "sm-" + this.metaData.roomName + "-" + Game.time;
          const spawned = Utils.spawn(this.kernel, this.metaData.roomName, "worker", creepName, {});
          if (spawned)
          {
            this.metaData.repairCreeps.push(creepName);
            this.kernel.addProcess(RepairerLifetimeProcess, "rlf-" + creepName, 29, {
              creep: creepName,
              roomName: this.metaData.roomName
            });
          }
        }
        else
        {
          const creepName = this.metaData.spareCreeps.pop() as string;
          this.metaData.repairCreeps.push(creepName);
          this.kernel.addProcess(RepairerLifetimeProcess, "rlf-" + creepName, 29, {
            creep: creepName,
            roomName: this.metaData.roomName
          });
        }
      }
    }
  }
}
