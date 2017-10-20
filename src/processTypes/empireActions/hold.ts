import { Process } from "../../os/process";
import { HoldProcess } from "../creepActions/hold";

import { Utils } from "../../lib/utils";

export class HoldRoomProcess extends Process
{
  public type = "holdRoom";

  public run()
  {
    const flag = Game.flags[this.metaData.flag];

    if (!flag)
    {
      this.completed = true;
      return;
    }

    const creep = Game.creeps[this.metaData.creep];

    if (!creep)
    {
      // Spawn a new Creep
      const spawned = Utils.spawn(
        this.kernel,
        Utils.nearestRoom(flag.pos.roomName, 1300),
        "hold",
        "h-" + flag.pos.roomName + "-" + Game.time,
        {}
      );

      if (spawned)
      {
        this.metaData.creep = "h-" + flag.pos.roomName + "-" + Game.time;
      }
    }
    else
    {
      // Use the existing creep
      this.fork(HoldProcess, "hold-" + creep.name, 30, {
        flag: flag.name,
        creep: creep.name
      });
    }
  }
}
