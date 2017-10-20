import { Utils } from "../../lib/utils";
import { Process } from "../../os/process";

import { DistroLifetimeProcess } from "../lifetimes/distro";
import { HarvesterLifetimeProcess } from "../lifetimes/harvester";
import { UpgraderLifetimeProcess } from "../lifetimes/upgrader";

export class EnergyManagementProcess extends Process
{
  public metaData: EnergyManagementMetaData;

  public type = "em";

  public ensureMetaData()
  {
    if (!this.metaData.harvestCreeps)
    {
      this.metaData.harvestCreeps = {};
    }

    if (!this.metaData.distroCreeps)
    {
      this.metaData.distroCreeps = {};
    }

    if (!this.metaData.upgradeCreeps)
    {
      this.metaData.upgradeCreeps = [];
    }

    if (!this.metaData.linkRequests)
    {
      this.metaData.linkRequests = [];
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

    if (!this.room().controller!.my)
    {
      this.completed = true;
      return;
    }

    const proc = this;
    const sources = this.kernel.data.roomData[this.metaData.roomName].sources;

    let safe = true;
    if (this.room().find(FIND_HOSTILE_CREEPS).length > 0)
    {
      safe = false;
    }

    _.forEach(sources, function(source)
    {
      if (!proc.metaData.harvestCreeps[source.id])
      {
        proc.metaData.harvestCreeps[source.id] = [];
      }

      const creepNames = Utils.clearDeadCreeps(proc.metaData.harvestCreeps[source.id]);
      proc.metaData.harvestCreeps[source.id] = creepNames;
      const creeps = Utils.inflateCreeps(creepNames);
      const workRate = Utils.workRate(creeps, 2);

      if (workRate < (source.energyCapacity / 300) && safe)
      {
        const creepName = "em-" + proc.metaData.roomName + "-" + Game.time;

        const spawnRoom = proc.metaData.roomName;

        if (proc.room().energyCapacityAvailable < 800 && proc.roomData().spawns.length > 0)
        {
          const nearestRoom = Utils.nearestRoom(proc.metaData.roomName, 800);

          proc.log("nr: " + nearestRoom);

          if (nearestRoom !== "")
          {
            // spawnRoom = nearestRoom
          }
        }

        const spawned = Utils.spawn(
          proc.kernel,
          spawnRoom,
          "harvester",
          creepName,
          {}
        );

        if (spawned)
        {
          proc.metaData.harvestCreeps[source.id].push(creepName);
        }
      }

      _.forEach(creeps, function(creep)
      {
        if (!proc.kernel.hasProcess("hlf-" + creep.name))
        {
          proc.kernel.addProcess(HarvesterLifetimeProcess, "hlf-" + creep.name, 49, {
            creep: creep.name,
            source: source.id
          });
        }
      });
    });

    _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, function(container)
    {
      if (proc.metaData.distroCreeps[container.id])
      {
        const creep = Game.creeps[proc.metaData.distroCreeps[container.id]];

        if (!creep)
        {
          delete proc.metaData.distroCreeps[container.id];
          return;
        }
      }
      else
      {
        const creepName = "em-m-" + proc.metaData.roomName + "-" + Game.time;

        const link = container.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: function(structure: Structure)
          {
            return (structure.structureType === STRUCTURE_LINK);
          }
        })[0] as StructureLink;

        if (safe && !link)
        {
          const spawned = Utils.spawn(
            proc.kernel,
            proc.metaData.roomName,
            "mover",
            creepName,
            {}
          );

          if (spawned)
          {
            proc.metaData.distroCreeps[container.id] = creepName;
            proc.kernel.addProcess(DistroLifetimeProcess, "dlp-" + creepName, 48, {
              sourceContainer: container.id,
              creep: creepName
            });
          }
        }
      }
    });

    if (this.room().storage)
    {
      const container = this.room().storage!;
      if (proc.metaData.distroCreeps[container.id])
      {
        const creep = Game.creeps[proc.metaData.distroCreeps[container.id]];

        if (!creep)
        {
          delete proc.metaData.distroCreeps[container.id];
          return;
        }
      }
      else
      {
        const creepName = "em-m-" + proc.metaData.roomName + "-" + Game.time;
        const spawned = Utils.spawn(
          proc.kernel,
          proc.metaData.roomName,
          "mover",
          creepName,
          {}
        );

        if (spawned)
        {
          proc.metaData.distroCreeps[container.id] = creepName;
          proc.kernel.addProcess(DistroLifetimeProcess, "dlp-" + creepName, 48, {
            sourceContainer: container.id,
            creep: creepName
          });
        }
      }
    }

    this.metaData.upgradeCreeps = Utils.clearDeadCreeps(this.metaData.upgradeCreeps);

    if (this.metaData.upgradeCreeps.length < 2 &&
        (this.kernel.data.roomData[this.metaData.roomName].generalContainers.length > 0 ||
        this.kernel.data.roomData[this.metaData.roomName].links.length >= 2))
    {
      const creepName = "em-u-" + proc.metaData.roomName + "-" + Game.time;
      const spawned = Utils.spawn(
        proc.kernel,
        proc.metaData.roomName,
        "worker",
        creepName,
        {}
      );

      if (spawned)
      {
        this.metaData.upgradeCreeps.push(creepName);
        this.kernel.addProcess(UpgraderLifetimeProcess, "ulf-" + creepName, 30, {
          creep: creepName
        });
      }
    }
  }
}
