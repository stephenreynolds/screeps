import * as creepActions from "../creepActions";

export function run(creep: Creep) {
  const hostile = creep.pos.findClosestByPath<Creep>(FIND_HOSTILE_CREEPS);

  if (hostile !== undefined) {
    if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, hostile.pos);
    }
  }
}
