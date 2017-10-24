import { Utils } from "../../lib/Utils";
import { Process } from "../../OS/Process";
import { RangerLifetimeProcess } from "../Lifetimes/Ranger";

export class RangerManagementProcess extends Process
{
  public type = "rangerManagement";

  public run()
  {
    this.metaData.rangers = Utils.clearDeadCreeps(this.metaData.rangers);

    if (!this.flag())
    {
      this.completed = true;
      return;
    }

    const count = this.metaData.rangers.length;
    const counted = _.filter(this.metaData.rangers, function(creepName: string)
    {
      const creep = Game.creeps[creepName];

      return (creep.ticksToLive > 300);
    }).length;

    if (_.min([count, counted]) < this.metaData.count)
    {
      const creepName = "ranger-" + Game.time;

      const spawned = Utils.spawn(
        this.kernel,
        Utils.nearestRoom(this.flag().pos.roomName, 1300),
        "ranger",
        creepName,
        {}
      );

      if (spawned)
      {
        this.metaData.rangers.push(creepName);
        this.kernel.addProcess(RangerLifetimeProcess, creepName + "-lifetime", this.priority - 1, {
          creep: creepName,
          flag: this.metaData.flag
        });
      }
    }
  }
}
