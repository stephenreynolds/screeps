import { harvest, moveTo, moveToRoom, workingToggle } from "utils/creeps";
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
  if (!moveToRoom(creep, creep.memory.home)) {
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
  if (!moveToRoom(creep, creep.memory.targetRoom)) {
    const source = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    harvest(creep, source);
  }
}
