import { getResourceFromSource, moveTo, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  workingToggle(creep);

  if (creep.memory.working) {
    upgrade(creep);
  }
  else {
    getResourceFromSource(creep, RoomData.sources);
  }
}

function upgrade(creep: Creep) {
  const controller = creep.room.controller!;

  if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
    moveTo(creep, controller.pos);
  }
}
