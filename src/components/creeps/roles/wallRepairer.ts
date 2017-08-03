import * as creepActions from "../creepActions";
import * as roleRepairer from "./repairer";

/**
 * Repair walls when working, harvest when out of energy.
 * Fallback to repairer role when no walls need repairing.
 * @param creep
 */
export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
    creep.memory.targetId = undefined;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;

    const structures = creep.room.find<Structure>(FIND_STRUCTURES, {
      filter: (s: Structure) => {
        return s.structureType === STRUCTURE_WALL && s.hits < s.hitsMax;
      }
    });

    creep.memory.targetId = _.sample(structures).id;
  }

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    creepActions.harvest(creep);
  }
}

/**
 * Repairs walls or fallback to repairer role if no walls need repairing.
 * @param creep
 */
function repair(creep: Creep) {
  const wall = Game.getObjectById(creep.memory.targetId) as StructureWall;

  if (wall !== undefined) {
    if (creep.repair(wall) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, wall.pos);
    }
  }
  else {
    roleRepairer.run(creep);
  }
}
