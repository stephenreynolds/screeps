import { getResourceFromSource, moveTo, withdraw } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleWallRepairer from "./wallRepairer";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
    creep.memory.rampartId = undefined;
  }
}

/**
 * Repairs ramparts or fallback to wall repairer role if no walls need repairing.
 * @param creep
 */
function repair(creep: Creep) {
  const rampart = Game.getObjectById<Rampart>(creep.memory.rampartId);

  if (rampart !== null) {
    const action = creep.repair(rampart);
    if (action === ERR_NOT_IN_RANGE) {
      moveTo(creep, rampart.pos);
    }
    else if (action !== OK) {
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
    const ramparts = _.filter(RoomData.ramparts, (r: Rampart) => {
      return r.hits < r.hitsMax;
    });

    let rampart = ramparts[0];
    for (const r of ramparts) {
      if (r.hits < rampart.hits) {
        rampart = r;
      }
    }

    if (rampart !== undefined) {
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
