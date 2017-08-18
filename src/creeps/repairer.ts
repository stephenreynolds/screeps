import { getResourceFromSource, repair, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleUpgrader from "./upgrader";

export function run(creep: Creep): void {
  workingToggle(creep);

  if (creep.memory.working) {
    repairStructure(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function repairStructure(creep: Creep) {
  if (creep.room.memory.repairTarget !== undefined) {
    const target = Game.getObjectById<Structure>(creep.room.memory.repairTarget)!;
    repair(creep, target);
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

    if (container !== null) {
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

    const repairers = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "repairer";
    });

    for (const c of RoomData.containers) {
      let num = 0;

      for (const repairer of repairers) {
        if (repairer.memory.containerId === c.id) {
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
