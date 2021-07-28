import { Process } from "processes/process";
import { Utils } from "utils/utils";
import { RemoteMinerCreepProcess } from "processes/creeps/remoteMiner";

export class RemoteMiningManagementProcess extends Process {
  public type = "rmman";

  public run() {
    const flag = Game.flags[this.metaData.flag];

    if (!flag) {
      this.completed = true;
      return;
    }

    if (!flag.memory.source) {
      const sources = flag.pos.lookFor(LOOK_SOURCES) as Source[];
      flag.memory.source = sources[0].id;
    }

    const deliverRoom = flag.name.split("-")[0];

    if (Game.rooms[deliverRoom].energyAvailable < 600) {
      return;
    }

    const miningCreep = Game.creeps[this.metaData.miningCreep];

    if (!miningCreep) {
      const spawned = Utils.spawn(
        this.scheduler,
        deliverRoom,
        "worker",
        "rm-" + flag.pos.roomName + "-" + Game.time,
        {}
      );

      if (spawned) {
        this.metaData.miningCreep = "rm-" + flag.pos.roomName + "-" + Game.time;
      }
    }
    else {
      this.scheduler.addProcessIfNotExist(RemoteMinerCreepProcess, "rmcreep-" + miningCreep.name, this.priority, {
        creep: miningCreep.name,
        flag: flag.name,
        deliverRoom: deliverRoom
      });
    }
  }
}
