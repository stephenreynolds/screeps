import { Process } from "processes/process";
import { MoveProcess } from "./move";

export class MineralHarvestProcess extends Process {
  public type = "mh";

  public run() {
    const creep = Game.creeps[this.metaData.creep];

    if (!creep || creep.store.getFreeCapacity() > 0) {
      this.completed = true;
      this.resumeParent();
      return;
    }

    const mineral = Game.getObjectById(this.metaData.mineral) as Mineral;

    if (!creep.pos.isNearTo(mineral.pos)) {
      this.fork(MoveProcess, "move-" + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: {
          x: mineral.pos.x,
          y: mineral.pos.y,
          roomName: mineral.pos.roomName
        },
        range: 1
      });

      return;
    }

    const extractor = Game.getObjectById(this.metaData.extractor) as StructureExtractor;

    if (extractor.cooldown === 0) {
      creep.harvest(mineral);
    }
    else {
      this.suspend = extractor.cooldown;
    }
  }
}
