import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  workingToggle(creep);

  if (creep.memory.working) {
    upgrade(creep);
  }
  else {
    getEnergy(creep);
  }
}

function upgrade(creep: Creep) {
  const controller = creep.room.controller!;

  if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
    moveTo(creep, controller.pos);
  }
}

function getEnergy(creep: Creep) {
  if (RoomData.upgradeContainer !== undefined && RoomData.upgradeContainer.store[RESOURCE_ENERGY]! > 0) {
    withdraw(creep, RoomData.upgradeContainer, RESOURCE_ENERGY);
  }
  else {
    getResourceFromSource(creep, RoomData.sources);
  }
}
