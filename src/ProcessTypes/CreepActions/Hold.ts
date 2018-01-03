import { Process } from "../../OS/Process";
import { MoveProcess } from "./Move";

export class HoldProcess extends Process
{
  public type = "hold";

  public run()
  {
    const creep = Game.creeps[this.metaData.creep];
    const flag = Game.flags[this.metaData.flag];

    if (!creep || !flag)
    {
      this.completed = true;
      return;
    }

    if (creep.room.name === flag.pos.roomName)
    {
      if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0)
      {
        if (!Memory.remoteRoomStatus)
        {
          Memory.remoteRoomStatus = {};
        }

        Memory.remoteRoomStatus[creep.room.name] = false;
      }
      else
      {
        if (!Memory.remoteRoomStatus)
        {
          Memory.remoteRoomStatus = {};
        }

        Memory.remoteRoomStatus[creep.room.name] = true;
      }
    }

    if (!creep.pos.isNearTo(flag.pos))
    {
      this.fork(MoveProcess, "move-" + creep.name, 30, {
        creep: creep.name,
        pos: flag.pos,
        range: 1
      });
      return;
    }
    else
    {
      creep.reserveController(creep.room.controller!);
      creep.signController(creep.room.controller!, "Colony of kumikill. Attempt no spawning here.");
    }
  }
}
