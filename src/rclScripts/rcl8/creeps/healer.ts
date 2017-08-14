/**
 * Role: Healer
 * Description: Heals creeps
 * Parts: HEAL, MOVE
 */

import { moveTo } from "utils/creeps";
import { notFullHealth } from "utils/structures";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  const target = creep.pos.findClosestByPath<Creep>(RoomData.creeps, {
    filter: (c: Creep) => {
      return notFullHealth(c);
    }
  });

  if (creep.heal(target) === ERR_NOT_IN_RANGE) {
    moveTo(creep, target.pos);
  }
}
