import { LifetimeProcess } from "../../os/LifetimeProcess";

import { MoveProcess } from "../creepActions/move";

export class RangerLifetimeProcess extends LifetimeProcess
{
  public type = "rangerLifetime";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    const flag = Game.flags[this.metaData.flag];

    if (!flag)
    {
      this.completed = true;

      return;
    }

    if (creep.room.name !== flag.pos.roomName)
    {
      this.fork(MoveProcess, "move-" + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: {
          x: flag.pos.x,
          y: flag.pos.y,
          roomName: flag.pos.roomName
        },
        range: 1
      });

      return;
    }

    const hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

    if (hostiles.length > 0)
    {
      const nearestHostile = creep.pos.findClosestByRange(hostiles) as Creep;

      if (creep.rangedAttack(nearestHostile) === ERR_NOT_IN_RANGE)
      {
        creep.moveTo(nearestHostile);
      }
    }
    else
    {
      if (!creep.pos.inRangeTo(flag.pos, 2))
      {
        creep.moveTo(flag);
      }
    }
  }
}
