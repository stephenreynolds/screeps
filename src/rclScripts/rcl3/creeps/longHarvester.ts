import { getResourceFromSource, moveTo, moveToRoom, workingToggle } from "utils/creeps";
import { notFull } from "utils/structures";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  workingToggle(creep);

  if (creep.memory.working) {
    transfer(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function transfer(creep: Creep) {
  if (creep.room.name !== creep.memory.home || creep.pos.x * creep.pos.y === 0 ||
    Math.abs(creep.pos.x) === 49 || Math.abs(creep.pos.y) === 49) {
    moveToRoom(creep, creep.memory.home);
  }
  else {
    const structure = _.find(RoomData.structures, (s: Structure) => {
      return notFull(s, RESOURCE_ENERGY) &&
        s.structureType !== STRUCTURE_CONTAINER;
    });

    if (structure !== undefined) {
      if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        moveTo(creep, structure.pos);
      }
    }
  }
}

function getEnergy(creep: Creep) {
  if (creep.room.name !== creep.memory.targetRoom || creep.pos.x * creep.pos.y === 0 ||
    Math.abs(creep.pos.x) === 49 || Math.abs(creep.pos.y) === 49) {
    moveToRoom(creep, creep.memory.targetRoom);
  }
  else {
    getResourceFromSource(creep, RoomData.sources);
  }
}
