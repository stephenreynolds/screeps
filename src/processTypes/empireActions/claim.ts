import { Utils } from "../../lib/utils";
import { Process } from "../../os/process";
import { MoveProcess } from "../creepActions/move";

interface ClaimProcessMetaData
{
  creep: string;
  targetRoom: string;
  flagName: string;
}

export class ClaimProcess extends Process
{
  public metaData: ClaimProcessMetaData;
  public type = "claim";

  public run()
  {
    const creep = Game.creeps[this.metaData.creep];

    const flag = Game.flags[this.metaData.flagName];

    if (!flag)
    {
      this.completed = true;
      return;
    }

    if (!creep)
    {
      const creepName = "claim-" + this.metaData.targetRoom + "-" + Game.time;
      const spawned = Utils.spawn(
        this.kernel,
        Utils.nearestRoom(this.metaData.targetRoom, 550),
        "claimer",
        creepName,
        {}
      );

      if (spawned)
      {
        this.metaData.creep = creepName;
      }

      return;
    }

    const room = Game.rooms[this.metaData.targetRoom];

    if (!room)
    {
      this.kernel.addProcess(MoveProcess, "move-" + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: flag.pos,
        range: 1
      });

      this.suspend = "move-" + creep.name;
    }
    else
    {
      creep.claimController(creep.room.controller!);
      this.completed = true;
      flag.remove();
    }
  }
}
