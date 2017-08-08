/**
 * Role: Rampart Repairer
 * Description: Melee creep attacks spawns and structures; creeps when close
 * Fallback: Wall Repairer
 */

import { RoomData } from "roomData";
import { notFullHealth } from "utils";
import { moveTo } from "../creepUtils/creepUtils";
import { getEnergy } from "../creepUtils/getResource";
import * as roleWallRepairer from "./wallRepairer";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
    creep.memory.targetId = undefined;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;

    const ramparts = _.filter(RoomData.ramparts, (r: Rampart) => {
      return notFullHealth(r);
    });

    if (ramparts[0] !== undefined) {
      creep.memory.targetId = _.sample(ramparts).id;
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
 * Repairs ramparts or fallback to wall repairer role if no walls need repairing.
 * @param creep
 */
function repair(creep: Creep) {
  const rampart = Game.getObjectById(creep.memory.targetId) as StructureRampart;

  if (rampart !== null) {
    if (rampart.hits === rampart.hitsMax) {
      creep.memory.working = false;
    }
    else if (creep.repair(rampart) === ERR_NOT_IN_RANGE) {
      moveTo(creep, rampart.pos);
    }
  }
  else {
    roleWallRepairer.run(creep);
  }
}
