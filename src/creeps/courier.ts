import { log } from "lib/logger/log";
import { withdraw } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleUpgrader from "./upgrader";

export function run(creep: Creep) {
  creep.workingToggle();

  if (creep.memory.working) {
    transfer(creep);
  }
  else {
    delete creep.memory.structureId;
    getEnergy(creep);
  }
}

function transfer(creep: Creep) {
  const structure = Game.getObjectById<Structure>(creep.memory.structureId);

  if (structure !== null) {
    const action = creep.transfer(structure, RESOURCE_ENERGY);
    switch (action) {
      case ERR_NOT_IN_RANGE:
        creep.moveToTarget(structure.pos);
        break;
      case ERR_FULL:
        delete creep.memory.structureId;
        break;
      case OK:
        break;
      default:
        log.error(`Creep ${creep.name} cannot transfer energy to ${structure}: error ${action}`);
        break;
    }
  }
  else {
    if (!reassignStructure(creep)) {
      RoleUpgrader.run(creep);
    }
  }
}

function getEnergy(creep: Creep) {
  if (RoomData.storage && RoomData.storage.store[RESOURCE_ENERGY]! > 0) {
    withdraw(creep, RoomData.storage, RESOURCE_ENERGY);
  }
  else if ((RoomData.creepsOfRole as any)["accountant"] === 0 && RoomData.storageToLink
    && RoomData.storageToLink.energy > 0) {
    withdraw(creep, RoomData.storageToLink, RESOURCE_ENERGY);
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
  if (RoomData.containers[0] !== undefined) {
    let container = null;

    const couriers = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "courier";
    });

    for (const c of RoomData.containers) {
      let num = 0;

      for (const courier of couriers) {
        if (courier.memory.containerId === c.id) {
          num++;
        }
      }

      if (num >= 3) {
        break;
      }
      else {
        container = c;
      }
    }

    if (container !== null) {
      creep.memory.containerId = container.id;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

function reassignStructure(creep: Creep) {
  if (creep.room.memory.DEFCON > 0) {
    const towers = _.filter(RoomData.towers, (t: Tower) => t.energy < t.energyCapacity / 2);

    if (towers[0]) {
      const tower = creep.pos.findClosestByPath(towers);

      if (tower) {
        creep.memory.structureId = tower.id;
        return true;
      }
    }
  }

  if (RoomData.structures[0]) {
    const structures = _.filter(RoomData.structures, (s: StructureSpawn | StructureExtension | StructureTower) => {
      return s.energy < s.energyCapacity && s.structureType !== STRUCTURE_CONTAINER
        && s.structureType !== STRUCTURE_LINK && s.structureType !== STRUCTURE_STORAGE;
    });

    const structure = creep.pos.findClosestByPath(structures);

    if (structure) {
      creep.memory.structureId = structure.id;
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
