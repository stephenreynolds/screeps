import * as creepActions from "../creepActions";
import * as roleWallRepairer from "./wallRepairer";

/**
 * Repair ramparts when working, harvest when out of energy.
 * Fallback to wall repairer role when no ramparts need repairing.
 * @param creep
 */
export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
    creep.memory.targetId = undefined;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;

    const structures = creep.room.find<StructureRampart>(FIND_STRUCTURES, {
      filter: (s: Structure) => {
        return s.structureType === STRUCTURE_RAMPART && s.hits < s.hitsMax;
      }
    });

    if (structures[0] !== undefined) {
      creep.memory.targetId = _.sample(structures).id;
    }
  }

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    creepActions.harvest(creep);
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
      creepActions.moveTo(creep, rampart.pos);
    }
  }
  else {
    roleWallRepairer.run(creep);
  }
}
