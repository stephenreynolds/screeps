/**
 * Role: Repairer
 * Description: Repairs structures
 * Parts: WORK, CARRY, MOVE
 * Fallback: Builder
 */

import { RoomData } from "roomData";
import { moveTo } from "../creepUtils/creepUtils";
import { getEnergy } from "../creepUtils/getResource";
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
    getEnergy(creep);
  }
}

function repair(creep: Creep) {
  if (creep.memory.targetId !== undefined) {
    const structure = Game.getObjectById(creep.memory.targetId) as Structure;

    if (structure !== null) {
      if (structure.hits < structure.hitsMax && creep.repair(structure) === ERR_NOT_IN_RANGE) {
        moveTo(creep, structure.pos);
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
    const structure = _.sample(_.filter(RoomData.structures, (s: Structure) => {
      return s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
        && s.structureType !== STRUCTURE_RAMPART;
    }));

    if (structure !== undefined) {
      creep.memory.targetId = structure.id;
    }
    else {
      roleBuilder.run(creep);
    }
  }
}
