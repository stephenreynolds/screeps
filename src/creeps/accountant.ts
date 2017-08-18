import { transfer, withdraw } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) > 0) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    transferEnergy(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function transferEnergy(creep: Creep) {
  transfer(creep, RoomData.storage!, RESOURCE_ENERGY);
}

function getEnergy(creep: Creep) {
  withdraw(creep, RoomData.storageToLink!, RESOURCE_ENERGY);
}
