export function run(creep: Creep) {
  const targetRoom = Game.rooms[creep.memory.targetRoom];

  if (!creep.moveToRoom(creep.memory.targetRoom)) {
    const controller = targetRoom.controller as Controller;
    if (creep.reserveController(controller) === ERR_NOT_IN_RANGE) {
      creep.moveToTarget(controller.pos);
    }
    if (controller.sign && controller.sign.username !== "kumikill") {
      creep.signController(controller, "Colony of kumikill. Attempt no spawning here.");
    }
  }
}
