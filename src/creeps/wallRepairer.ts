/**
 * Role: Wall Repairer
 * Description: Repairs walls
 * Fallback: Repairer
 */

import { RoomData } from "roomData";
import { notFullHealth } from "utils";
import { moveTo } from "../creepUtils/creepUtils";
import { getEnergy } from "../creepUtils/getResource";
import * as roleRepairer from "./repairer";

/**
 * Repair walls when working, harvest when out of energy.
 * Fallback to repairer role when no walls need repairing.
 * @param creep
 */
export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
    creep.memory.targetId = undefined;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;

    const walls = _.filter(RoomData.walls, (w: StructureWall) => {
      return notFullHealth(w);
    });

    if (walls[0] !== undefined) {
      creep.memory.targetId = _.sample(walls).id;
    }
  }

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

/**
 * Repairs walls or fallback to repairer role if no walls need repairing.
 * @param creep
 */
function repair(creep: Creep) {
  const wall = Game.getObjectById(creep.memory.targetId) as StructureWall;

  if (wall !== null) {
    if (creep.repair(wall) === ERR_NOT_IN_RANGE) {
      moveTo(creep, wall.pos);
    }
  }
  else {
    roleRepairer.run(creep);
  }
}
