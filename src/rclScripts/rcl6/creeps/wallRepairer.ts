/**
 * Role: Wall Repairer
 * Description: Repairs walls
 * Parts: WORK, CARRY, MOVE
 * Fallback: Repairer
 */

import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleRepairer from "./repairer";

export function run(creep: Creep): void {
  workingToggle(creep);

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function repair(creep: Creep) {
  if (creep.memory.targetId !== undefined) {
    const wall = Game.getObjectById(creep.memory.targetId) as StructureWall;

    if (wall !== null) {
      if (wall.hits < wall.hitsMax && creep.repair(wall) === ERR_NOT_IN_RANGE) {
        moveTo(creep, wall.pos);
      }
      else {
        creep.memory.targetId = undefined;
      }
    }
    else {
      creep.memory.targetId = undefined;
    }
  }
  else {
    const wall = _.sample(_.filter(RoomData.walls, (s: StructureWall) => {
      return s.hits < s.hitsMax;
    }));

    if (wall !== undefined) {
      creep.memory.targetId = wall.id;
    }
    else {
      RoleRepairer.run(creep);
    }
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

    const rampartRepairers = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "rampartRepairer";
    });

    for (const c of RoomData.containers) {
      let num = 0;

      for (const rampartRepairer of rampartRepairers) {
        if (rampartRepairer.memory.containerId === c.id) {
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
