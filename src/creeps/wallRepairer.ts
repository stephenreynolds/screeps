import { withdraw } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleBuilder from "./builder";

export function run(creep: Creep): void {
  creep.workingToggle();

  if (creep.memory.working) {
    repair(creep);
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
    if (creep.carry.energy === 0) {
      creep.memory.targetId = undefined;
    }
  }
}

function repair(creep: Creep) {
  if (creep.memory.targetId !== undefined) {
    const wall = Game.getObjectById(creep.memory.targetId) as StructureWall;

    if (wall !== null) {
      if (wall.hits < wall.hitsMax && creep.repair(wall) === ERR_NOT_IN_RANGE) {
        creep.moveToTarget(wall.pos);
      }
    }
    else {
      creep.memory.targetId = undefined;
    }
  }
  else {
    const walls = _.filter(RoomData.walls, (s: StructureWall) => {
      return s.hits < s.hitsMax;
    });

    let wall = walls[0];
    for (const w of walls) {
      if (w.hits < wall.hits) {
        wall = w;
      }
    }

    if (wall !== undefined) {
      creep.memory.targetId = wall.id;
    }
    else {
      RoleBuilder.run(creep);
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
      creep.getResourceFromSource(RoomData.sources);
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
