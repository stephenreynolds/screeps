/**
 * Role: Sentinel
 * Description: melee creep attacks hostile creeps when in owned room.
 */

import { RoomData } from "roomData";
import { moveTo } from "../creepUtils/creepUtils";

export function run(creep: Creep) {
  const hostile = creep.pos.findClosestByPath<Creep>(RoomData.hostileCreeps);

  if (hostile !== undefined) {
    if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
      moveTo(creep, hostile.pos);
    }
  }
}
