import * as creepActions from "../creepActions";

export function run(creep: Creep) {
  const target = creep.pos.findClosestByPath<Creep>(FIND_MY_CREEPS, {
      filter: (c: Creep) => {
        return c.hits < c.hitsMax;
      }
  });

  if (creep.heal(target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}
