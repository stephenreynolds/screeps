/**
 * Role: Claimer
 * Description: claims a room then upgrades its controller.
 * Fallback: Upgrader
 */

import { moveTo, moveToRoom } from "../creepUtils/creepUtils";
import * as roleUpgrader from "./upgrader";

export function run(creep: Creep) {
  const targetRoom = Game.rooms[creep.memory.targetRoom];
  const controller = targetRoom.controller as Controller;

  if (creep.room.name !== creep.memory.targetRoom || creep.pos.x * creep.pos.y === 0 ||
    Math.abs(creep.pos.x) === 49 || Math.abs(creep.pos.y) === 49) {
    moveToRoom(creep, creep.memory.targetRoom);
  }
  else if (controller.my) {
    roleUpgrader.run(creep);
  }
  else {
    if (controller.level > 0) {
      if (creep.attackController(controller) === ERR_NOT_IN_RANGE) {
        moveTo(creep, controller.pos);
      }
    }
    else {
      switch (creep.claimController(controller)) {
        case ERR_NOT_IN_RANGE:
          moveTo(creep, controller.pos);
          break;
        case ERR_GCL_NOT_ENOUGH:
          creep.reserveController(controller);
          break;
      }
    }
  }
}
