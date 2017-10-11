export function run(creep: Creep) {
  const targetRoom = Game.rooms[creep.memory.targetRoom];

  if (!creep.moveToRoom(creep.memory.targetRoom)) {
    const controller = targetRoom.controller as Controller;
    if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveToTarget(controller.pos);
    }
  }
}
