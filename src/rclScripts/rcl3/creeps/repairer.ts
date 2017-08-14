/**
 * Role: Repairer
 * Description: Repairs structures
 * Parts: WORK, CARRY, MOVE
 * Fallback: Upgrader
 */

import { getResourceFromSource, moveTo, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleUpgrader from "./upgrader";

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
    const structure = Game.getObjectById(creep.memory.targetId) as Structure;

    if (structure !== null) {
      if (structure.hits < structure.hitsMax && creep.repair(structure) === ERR_NOT_IN_RANGE) {
        moveTo(creep, structure.pos);
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
    const structure = _.sample(_.filter(RoomData.structures, (s: Structure) => {
      return s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
        && s.structureType !== STRUCTURE_RAMPART;
    }));

    if (structure !== undefined) {
      creep.memory.targetId = structure.id;
    }
    else {
      RoleUpgrader.run(creep);
    }
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
