/**
 * Role: Rampart Repairer
 * Description: repairs ramparts, or repairs walls, or repairs other.
 *   or builds structures, or upgrades controller.
 */

import * as creepActions from "../creepActions";
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
    creepActions.harvest(creep);
  }
}

function repair(creep: Creep) {
  const rampart = creep.room.find<Structure>(FIND_STRUCTURES, {
      filter: (s: Structure) => {
        return s.hits < s.hitsMax && s.structureType === STRUCTURE_RAMPART;
      }
    })[0];

  if (rampart !== undefined) {
    if (creep.repair(rampart) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, rampart.pos);
    }
  }
  else {
    roleWallRepairer.run(creep);
  }
}
