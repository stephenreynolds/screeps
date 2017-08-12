/**
 * Role: Rampart Repairer
 * Description: Repair ramparts
 * Parts: WORK, CARRY, MOVE
 * Fallback: Wall Repairer
 */

import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleWallRepairer from "./wallRepairer";

export function run(creep: Creep): void {
  workingToggle(creep);

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

/**
 * Repairs ramparts or fallback to wall repairer role if no walls need repairing.
 * @param creep
 */
function repair(creep: Creep) {
  const rampart = Game.getObjectById<Rampart>(creep.memory.rampartId);

  if (rampart !== null) {
    if (rampart.hits < rampart.hitsMax && creep.repair(rampart) === ERR_NOT_IN_RANGE) {
      moveTo(creep, rampart.pos);
    }
    else {
      RoleWallRepairer.run(creep);
    }
  }
  else {
    if (!reassignRampart(creep)) {
      RoleWallRepairer.run(creep);
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

function reassignRampart(creep: Creep) {
  if (RoomData.ramparts[0] !== undefined) {
    let rampart = null;

    const rampartRepairers = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "rampartRepairer";
    });

    for (const r of RoomData.ramparts) {
      let num = 0;

      for (const rampartRepairer of rampartRepairers) {
        if (rampartRepairer.memory.rampartId === r.id) {
          num++;
        }
      }

      if (num >= 1) {
        break;
      }
      else {
        rampart = r;
      }
    }

    if (rampart !== null) {
      creep.memory.rampartId = rampart.id;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
