import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleUpgrader from "./upgrader";

export function run(creep: Creep) {
  workingToggle(creep);

  if (creep.memory.working) {
    transfer(creep);
  }
  else {
    getEnergy(creep);
  }
}

function transfer(creep: Creep) {
  if (creep.room.memory.energyTarget !== undefined) {
    const structure = Game.getObjectById<Structure>(creep.room.memory.energyTarget)!;
    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      moveTo(creep, structure.pos);
    }
  }
  else {
    RoleUpgrader.run(creep);
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
      getResourceFromSource(creep, RoomData.sources);
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
