import { Process } from "../../os/process";

import { Utils } from "../../lib/utils";

import { RemoteMinerLifetimeProcess } from "../lifetimes/remoteMiner";

export class RemoteMiningManagementProcess extends Process
{
  public type = "rmmp";

  public run()
  {
    const flag = Game.flags[this.metaData.flag];

    if (!flag)
    {
      this.completed = true;
      return;
    }

    if (!flag.memory.source)
    {
      const sources = flag.pos.lookFor(LOOK_SOURCES) as Source[];
      flag.memory.source = sources[0].id;
    }

    const deliverRoom = flag.name.split("-")[0];

    if (Game.rooms[deliverRoom].energyAvailable < 600)
    {
        return;
    }

    const miningCreep = Game.creeps[this.metaData.miningCreep];

    if (!miningCreep)
    {
      const spawned = Utils.spawn(
        this.kernel,
        deliverRoom,
        "worker",
        "rm-" + flag.pos.roomName + "-" + Game.time,
        {}
      );

      if (spawned)
      {
        this.metaData.miningCreep = "rm-" + flag.pos.roomName + "-" + Game.time;
      }
    }
    else
    {
      this.kernel.addProcessIfNotExist(RemoteMinerLifetimeProcess, "rmlf-" + miningCreep.name, this.priority, {
        creep: miningCreep.name,
        flag: flag.name,
        deliverRoom: deliverRoom
      });
    }
  }
}
