import { withdraw } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleRepairer from "./repairer";

export function run(creep: Creep): void {
  creep.workingToggle();

  if (creep.memory.working) {
    construct(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function construct(creep: Creep) {
  let site: ConstructionSite | undefined;

  if (creep.memory.targetId !== undefined) {
    const target = Game.getObjectById<ConstructionSite>(creep.memory.targetId);
    if (target !== null) {
      site = target;
    }
    else {
      creep.memory.targetId = undefined;
      Game.rooms[creep.memory.home].memory.construct = undefined;
    }
  }
  else {
    if (creep.room.memory.buildTarget !== undefined) {
      site = Game.getObjectById<ConstructionSite>(creep.room.memory.buildTarget)!;
    }
  }

  if (site !== undefined) {
    if (creep.build(site) === ERR_NOT_IN_RANGE) {
      creep.moveToTarget(site.pos);
    }
  }
  else {
    RoleRepairer.run(creep);
  }
}

function getEnergy(creep: Creep) {
  if (RoomData.storage !== undefined && RoomData.storage.store[RESOURCE_ENERGY]! > 0) {
    withdraw(creep, RoomData.storage, RESOURCE_ENERGY);
  }
  else {
    const container = Game.getObjectById<Container>(creep.memory.containerId);

    if (container !== null && container.store[RESOURCE_ENERGY] > 0) {
      withdraw(creep, container, RESOURCE_ENERGY);
    }
    else if (!reassignContainer(creep)) {
      creep.getResourceFromSource(RoomData.sources);
    }
  }
}

function reassignContainer(creep: Creep) {
  if (RoomData.containers !== undefined && RoomData.containers.length > 0) {
    const container = _.sample(RoomData.containers);
    creep.memory.containerId = container.id;
  }
  else {
    return false;
  }
}
