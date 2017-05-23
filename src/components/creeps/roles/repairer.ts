import * as creepActions from "../creepActions";
import * as roleBuilder from "./builder";

export function run(creep: Creep): void {
  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, creep.room.find<Spawn>(FIND_MY_SPAWNS)[0]);
  }
  else if (_.sum(creep.carry) === creep.carryCapacity) {
    repair(creep);
  }
  else {
    creepActions.harvest(creep);
  }
}

function repair(creep: Creep) {
  const structure = creep.pos.findClosestByPath<Structure>(FIND_STRUCTURES, {
      filter: (s: Structure) => {
        return s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL;
      }
    });
  if (structure !== undefined) {
    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, structure.pos);
    }
  }
  else {
    roleBuilder.run(creep);
  }
}
