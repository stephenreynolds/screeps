import { RoomData } from "../roomData";

export function run(creep: Creep) {
  const target = creep.pos.findClosestByPath<Creep>(RoomData.creeps, {
    filter: (c: Creep) => {
      return c.hits < c.hitsMax;
    }
  });

  if (creep.heal(target) === ERR_NOT_IN_RANGE) {
    creep.moveToTarget(target.pos);
  }
}
