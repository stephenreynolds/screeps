import { withdraw } from "utils/creeps";
import { RoomData } from "../roomData";
import * as roleCourier from "./courier";

export function run(creep: Creep): void {
  creep.workingToggle();

  if (creep.memory.working) {
    transfer(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function transfer(creep: Creep) {
  const structure = RoomData.storage;

  if (structure !== undefined) {
    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveToTarget(structure.pos);
    }
  }
  else {
    roleCourier.run(creep);
  }
}

function getEnergy(creep: Creep) {
  const container = Game.getObjectById<Container>(creep.memory.containerId);

  if (container !== null) {
    withdraw(creep, container, RESOURCE_ENERGY);
  }
  else if (!reassignContainer(creep)) {
    creep.getResourceFromSource(RoomData.sources);
  }
}

function reassignContainer(creep: Creep) {
  if (RoomData.containers[0] !== undefined) {
    let container = null;

    const transporters = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "transporter";
    });

    for (const c of RoomData.containers) {
      let num = 0;

      for (const transporter of transporters) {
        if (transporter.memory.containerId === c.id) {
          num++;
        }
      }

      if (RoomData.storageFromLink !== undefined && RoomData.storageToLink !== undefined) {
        if (num >= 1 || c.pos.isNearTo(RoomData.storageFromLink.pos)) {
          continue;
        }
        else {
          container = c;
        }
      }
      else {
        if (num >= 1) {
          continue;
        }
        else {
          container = c;
        }
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
