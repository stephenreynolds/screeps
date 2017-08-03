import * as creepActions from "../creepActions";

/**
 *
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
    transfer(creep);
  }
  else if (!creep.memory.working) {
    withdraw(creep);
  }
}

/**
 * Transfer energy to a structure that needs it. Fall back to upgrader role.
 * @param creep
 */
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
}

/**
 * Withdraw energy from the nearest container.
 * @param creep
 */
function withdraw(creep: Creep) {
  const source = creep.pos.findClosestByPath<Storage>(FIND_MY_STRUCTURES, {
    filter: (s: Storage) => {
      return s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY]! > 0;
    }
  });

  if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, source.pos);
  }
}
