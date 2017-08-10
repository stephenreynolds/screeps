/**
 * Role: Rampart Repairer
 * Description: Melee creep attacks spawns and structures; creeps when close
 * Parts: WORK, CARRY, MOVE
 * Fallback: Wall Repairer
 */

import { RoomData } from "roomData";
import { moveTo } from "../creepUtils/creepUtils";
import { getEnergy } from "../creepUtils/getResource";
import * as roleWallRepairer from "./wallRepairer";

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
 * Repairs ramparts or fallback to wall repairer role if no walls need repairing.
 * @param creep
 */
function repair(creep: Creep) {
  if (creep.memory.targetId !== undefined) {
    const rampart = Game.getObjectById(creep.memory.targetId) as StructureRampart;

    if (rampart !== null) {
      if (rampart.hits < rampart.hitsMax && creep.repair(rampart) === ERR_NOT_IN_RANGE) {
        moveTo(creep, rampart.pos);
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
    const rampart = _.sample(_.filter(RoomData.ramparts, (s: StructureRampart) => {
      return s.hits < s.hitsMax;
    }));

    if (rampart !== undefined) {
      creep.memory.targetId = rampart.id;
    }
    else {
      roleWallRepairer.run(creep);
    }
  }
}
