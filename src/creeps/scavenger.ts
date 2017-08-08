/**
 * Role: Scavenger
 * Description: Picks up dropped resources to upgrade controller.
 * Fallback: Harvester
 */

import { RoomData } from "roomData";
import { moveTo } from "../creepUtils/creepUtils";
import * as roleHarvester from "./harvester";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    if (creep.carry.energy !== undefined) {
      roleHarvester.run(creep);
    }
    else {
      // Set up minerals.
    }
  }
  else if (!creep.memory.working) {
    scavenge(creep);
  }
}

function scavenge(creep: Creep) {
  const resource = _.find(RoomData.dropped, (r: Resource) => {
    for (const c of RoomData.containers) {
      if (r.pos.isNearTo(c)) {
        return false;
      }
    }
    return true;
  });

  if (resource !== undefined) {
    if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
      moveTo(creep, resource.pos);
    }
  }
  else {
    roleHarvester.run(creep);
  }
}
