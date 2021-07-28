import { RCLPlan } from "./rclPlan";
import _ from "lodash";

export class RCL5 extends RCLPlan {
  public generate() {
    this.room.memory.roomPlan.rcl[5] = {};

    // Copy RCL 4
    this.room.memory.roomPlan.rcl[5].spawn = _.clone(this.room.memory.roomPlan.rcl[4].spawn);
    this.room.memory.roomPlan.rcl[5].road = _.clone(this.room.memory.roomPlan.rcl[4].road);
    this.room.memory.roomPlan.rcl[5].container = _.clone(this.room.memory.roomPlan.rcl[4].container);
    this.room.memory.roomPlan.rcl[5].extension = _.clone(this.room.memory.roomPlan.rcl[4].extension);
    this.room.memory.roomPlan.rcl[5].storage = _.clone(this.room.memory.roomPlan.rcl[4].storage);
    this.room.memory.roomPlan.rcl[5].tower = _.clone(this.room.memory.roomPlan.rcl[4].tower);
    this.room.memory.roomPlan.rcl[5].rampart = _.clone(this.room.memory.roomPlan.rcl[4].rampart);

    // Storage link and first source link
    const storageLinkPos = new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 4, this.room.name);
    const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[5].container, (c: RoomPosition) => {
      return c.findInRange(this.scheduler.data.roomData[this.room.name].sources, 1);
    }) as RoomPosition[];
    this.room.memory.roomPlan.rcl[5].link = [
      storageLinkPos,
      this.findEmptyInRange(this.baseSpawn.pos.findClosestByRange(sourceContainers)!, 1, this.baseSpawn.pos)
    ];

    // Extensions
    this.room.memory.roomPlan.rcl[5].extension = this.room.memory.roomPlan.rcl[5].extension.concat([
      new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 3, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 3, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 2, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 2, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 1, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 3, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 3, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 4, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 5, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 4, this.room.name)
    ]);

    // Extension roads
    this.room.memory.roomPlan.rcl[5].road = this.room.memory.roomPlan.rcl[5].road.concat([
      new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 1, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 2, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 3, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 4, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 3, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 5, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 6, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 7, this.room.name),
      new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 6, this.room.name)
    ]);

    // Tower
    this.room.memory.roomPlan.rcl[5].tower = this.room.memory.roomPlan.rcl[5].tower.concat([
      new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 3, this.room.name)
    ]);

    // Controller ramparts
    for (let y = this.controller.pos.y - 1; y <= this.controller.pos.y + 1; y++) {
      for (let x = this.controller.pos.x - this.controller.pos.x; x <= this.controller.pos.x + 1; x++) {
        if (this.room.lookForAt(LOOK_TERRAIN, x, y).indexOf("wall") === -1) {
          this.room.memory.roomPlan.rcl[5].rampart.push(new RoomPosition(x, y, this.room.name));
        }
      }
    }

    this.finished(5);
  }
}
