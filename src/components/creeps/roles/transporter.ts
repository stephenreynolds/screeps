import * as creepActions from "../creepActions";
import * as roleCourier from "./courier";

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
  const storage = creep.room.find<StructureStorage>(FIND_MY_STRUCTURES, {
    filter: (s: StructureStorage) => {
      return s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY]! < s.storeCapacity;
    }
  })[0];

  if (storage !== undefined) {
    if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, storage.pos);
    }
  }
  else {
    roleCourier.run(creep);
  }
}

/**
 * Withdraw energy from the nearest container.
 * @param creep
 */
function withdraw(creep: Creep) {
  const source = _.sample(creep.room.find<StructureContainer>(FIND_STRUCTURES, {
    filter: (s: StructureContainer) => {
      return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
    }
  }));

  if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, source.pos);
  }
}
