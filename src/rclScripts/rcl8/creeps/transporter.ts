/**
 * Role: Transporter
 * Description: Withdraws energy from mining containers and transfers to storage
 * Parts: WORK, CARRY, MOVE
 * Fallback: Courier
 */

import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as roleCourier from "./courier";

/**
 *
 * @param creep
 */
export function run(creep: Creep): void {
  workingToggle(creep);

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
      moveTo(creep, structure.pos);
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
    getResourceFromSource(creep, RoomData.sources);
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

      if (num >= 3) {
        break;
      }
      else {
        container = c;
      }
    }

    if (container !== null) {
      if (container !== null) {
        if (container.pos.isNearTo(RoomData.minerals[0].pos)) {
          if (RoomData.extractor !== undefined) {
            creep.memory.containerId = container.id;
          }
          else {
            return false;
          }
        }
        else {
          creep.memory.containerId = container.id;
        }
      }
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
