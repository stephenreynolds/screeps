/**
 * Role: Wall Repairer
 * Description: Repairs walls
 * Parts: WORK, CARRY, MOVE
 * Fallback: Repairer
 */

import { RoomData } from "roomData";
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
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
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
  if (creep.memory.targetId !== undefined) {
    const wall = Game.getObjectById(creep.memory.targetId) as StructureWall;

    if (wall !== null) {
      if (wall.hits < wall.hitsMax && creep.repair(wall) === ERR_NOT_IN_RANGE) {
        moveTo(creep, wall.pos);
      }
      else {
        creep.memory.targetId = undefined;
      }
    }
    else {
      creep.memory.targetId = undefined;
    }
  }
  else {
    const wall = _.sample(_.filter(RoomData.walls, (s: StructureWall) => {
      return s.hits < s.hitsMax;
    }));

    if (wall !== undefined) {
      creep.memory.targetId = wall.id;
    }
    else {
      roleRepairer.run(creep);
    }
  }
}
