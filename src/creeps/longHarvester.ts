import { harvest, transfer } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleCourier from "./courier";

export function run(creep: Creep) {
  creep.workingToggle();

  if (creep.memory.working) {
    supply(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function supply(creep: Creep) {
  if (!creep.moveToRoom(creep.memory.home)) {
    if (RoomData.storage !== undefined && _.sum(RoomData.storage.store) < RoomData.storage.storeCapacity) {
      transfer(creep, RoomData.storage, RESOURCE_ENERGY);
    }
    else {
      RoleCourier.run(creep);
    }
  }
}

function getEnergy(creep: Creep) {
  if (!creep.moveToRoom(creep.memory.targetRoom)) {
    const source = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    harvest(creep, source);
  }
}
