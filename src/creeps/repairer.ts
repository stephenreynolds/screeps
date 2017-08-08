/**
 * Role: Repairer
 * Description: Repairs structures.
 * Fallback: Builder
 */

import { RoomData } from "roomData";
import { notFullHealth } from "utils";
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
  const structure = _.find(RoomData.structures, (s: Structure) => {
    return s.structureType !== STRUCTURE_WALL
      && s.structureType !== STRUCTURE_RAMPART && notFullHealth(s);
  });

  if (structure !== undefined) {
    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
      moveTo(creep, structure.pos);
    }
  }
  else {
    roleBuilder.run(creep);
  }
}
