/**
 * Role: Wall Repairer
 * Description: repairs walls, or repairs other.
 *   or builds structures, or upgrades controller.
 */

import * as creepActions from "../creepActions";
import * as roleRepairer from "./repairer";

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
  let target;

  for (let perc = 0.0001; perc <= 1; perc += 0.0001) {
    target = creep.pos.findClosestByPath<Structure>(FIND_STRUCTURES, {
      filter: (s: Structure) => {
        return s.structureType === STRUCTURE_WALL && s.hits / s.hitsMax < perc;
      }
    });

    if (target !== undefined) {
      break;
    }
  }

  if (target !== undefined) {
    if (creep.repair(target) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, target.pos);
    }
  }
  else {
    roleRepairer.run(creep);
  }
}
