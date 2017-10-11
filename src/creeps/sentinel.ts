import { RoomData } from "../roomData";

export function run(creep: Creep) {
  const hostile = creep.pos.findClosestByPath<Creep>(RoomData.hostileCreeps);

  if (hostile !== undefined) {
    if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
      creep.moveToTarget(hostile.pos);
    }
  }
}
