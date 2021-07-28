import { RCLPlan } from "./rclPlan";

export class RCL1 extends RCLPlan {
  public generate() {
    this.room.memory.roomPlan.rcl[1] = {};

    // Spawns
    this.room.memory.roomPlan.rcl[1].spawn = [this.baseSpawn.pos];

    this.finished(1);
  }
}
