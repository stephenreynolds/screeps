/**
 * Role: Harvester
 * Description: transfers energy to structures which need it.
 */

import * as creepActions from "../creepActions";
import * as roleUpgrader from "./upgrader";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    transfer(creep);
  }
  else if (!creep.memory.working) {
    creepActions.harvest(creep);
  }
}

function transfer(creep: Creep) {
  const structure = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (s: any) => {
      return s.energy < s.energyCapacity;
    }
  })[0] as Structure;

  if (structure !== undefined) {
    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, structure.pos);
    }
  }
  else {
    roleUpgrader.run(creep);
  }
}
