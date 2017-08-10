/**
 * Role: Reserver
 * Description: Reserves a room.
 * Parts: CLAIM, MOVE
 */

import { moveTo, moveToRoom } from "../creepUtils/creepUtils";

export function run(creep: Creep) {
  const targetRoom = Game.rooms[creep.memory.targetRoom];

  if (creep.room.name !== creep.memory.targetRoom || creep.pos.x * creep.pos.y === 0 ||
    Math.abs(creep.pos.x) === 49 || Math.abs(creep.pos.y) === 49) {
    moveToRoom(creep, creep.memory.targetRoom);
  }
  else {
    const controller = targetRoom.controller as Controller;
    if (creep.reserveController(controller) === ERR_NOT_IN_RANGE) {
      moveTo(creep, controller.pos);
    }
  }
}
