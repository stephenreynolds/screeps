import { withdraw } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  creep.workingToggle();

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
    creep.moveToTarget(controller.pos);
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
  if (RoomData.containers[0] !== undefined) {
    let container = null;

    const upgraders = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "upgrader";
    });

    for (const c of RoomData.containers) {
      let num = 0;

      for (const upgrader of upgraders) {
        if (upgrader.memory.containerId === c.id) {
          num++;
        }
      }

      if (num >= 1) {
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
