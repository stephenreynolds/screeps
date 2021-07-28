import { Process } from "processes/process";
import { Utils } from "utils/utils";

import { MoveProcess } from "./move";

interface RepairProcessMetaData {
  creep: string;
  target: string;
}

export class RepairProcess extends Process {
  public metaData!: RepairProcessMetaData;
  public type = "repair";

  public run() {
    const creep = Game.creeps[this.metaData.creep];
    const target = Game.getObjectById(this.metaData.target) as Structure;

    if (!target || !creep || creep.store.getUsedCapacity() === 0) {
      this.completed = true;
      this.resumeParent();
      return;
    }

    if (!creep.pos.inRangeTo(target, 3)) {
      this.scheduler.addProcess(MoveProcess, creep.name + "-repair-move", this.priority + 1, {
        creep: creep.name,
        pos: {
          x: target.pos.x,
          y: target.pos.y,
          roomName: target.pos.roomName
        },
        range: 3
      });
      this.suspend = creep.name + "-repair-move";
    }
    else {
      if (target.hits === target.hitsMax || (target.structureType === STRUCTURE_RAMPART &&
        target.hits > Utils.rampartHealth(this.scheduler, creep.room.name))) {
        this.completed = true;
        this.resumeParent();
        return;
      }

      creep.repair(target);
    }
  }
}
