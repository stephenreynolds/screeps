/**
 * Role: Repairer
 * Description: repairs structures, or builds structures, or upgrades controller.
 */

import * as creepActions from "../creepActions";
import * as roleBuilder from "./builder";

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
  const structure = creep.room.find<Structure>(FIND_STRUCTURES, {
      filter: (s: Structure) => {
        return  s.structureType !== STRUCTURE_WALL
          && s.structureType !== STRUCTURE_RAMPART && s.hits < s.hitsMax;
      }
    })[0];

  if (structure !== undefined) {
    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, structure.pos);
    }
  }
  else {
    roleBuilder.run(creep);
  }
}
