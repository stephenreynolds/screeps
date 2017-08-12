/**
 * Role: Builder
 * Description: Builds structures
 * Parts: WORK, CARRY, MOVE
 * Fallback: Upgrader
 */

import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleRepairer from "./repairer";

export function run(creep: Creep): void {
  workingToggle(creep);

  if (creep.memory.working) {
    construct(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function construct(creep: Creep) {
  let site: ConstructionSite;
  const target = Game.getObjectById(creep.memory.targetId);

  if (target !== null) {
    site = target as ConstructionSite;
  }
  else {
    // Prioritize non-roads first.
    const nonRoads = _.filter(RoomData.sites, (s: ConstructionSite) => {
      return s.structureType !== STRUCTURE_ROAD;
    });

    if (nonRoads[0] !== undefined) {
      site = nonRoads[0];
    }
    else {
      site = RoomData.sites[0];
    }
  }

  if (site !== undefined) {
    if (creep.build(site) === ERR_NOT_IN_RANGE) {
      moveTo(creep, site.pos);
    }
  }
  else {
    RoleRepairer.run(creep);
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
  if (RoomData.containers !== undefined && RoomData.containers.length > 0) {
    let container = null;

    const builders = _.filter(RoomData.creeps, (c: Creep) => {
      return c.memory.role === "builder";
    });

    for (const c of RoomData.containers) {
      let num = 0;

      for (const builder of builders) {
        if (builder.memory.containerId === c.id) {
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
