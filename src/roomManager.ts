import * as Config from "config/config";
import * as CreepFactory from "creepFactory";
import "creepPrototype";
import * as DefenseManager from "defenseManager";
import * as JobManager from "jobManager";
import { log } from "lib/logger/log";
import { RoomData } from "roomData";
import * as StructureManager from "structureManager";

export function run(room: Room) {
  // Compile room data.
  compileRoomData(room);

  if (room.controller!.my) {
    DefenseManager.run();
    if (Game.time % 25 === 0 && room.name !== "W18S14") {
      StructureManager.run();
    }
    JobManager.run(room, RoomData.structures, RoomData.sites, RoomData.extensions,
      RoomData.towers, RoomData.spawns);

    // Keep track of invaders.
    if (room.memory.invadeRoom !== undefined) {
      const invaded = Game.rooms[room.memory.invadeRoom];
      if (invaded !== undefined) {
        RoomData.invaderCount = _.filter(invaded.find<Creep>(FIND_MY_CREEPS), (c: Creep) => {
          return c.memory.role === "invader";
        }).length;
      }
    }

    // Keep track of long harvesters.
    if (room.memory.colony !== undefined) {
      const colony = Game.rooms[room.memory.colony];
      if (colony !== undefined) {
        RoomData.longHarvesterCount = _.filter(colony.find<Creep>(FIND_MY_CREEPS), (c: Creep) => {
          return c.memory.role === "longHarvester";
        }).length + (RoomData.creepsOfRole as any)["longHarvester"];
      }
      else {
        RoomData.longHarvesterCount = (RoomData.creepsOfRole as any)["longHarvester"];
      }
    }

    // Run spawn.
    for (const spawn of RoomData.spawns) {
      if (spawn.spawning) {
        if (Config.ENABLE_DEBUG_MODE) {
          log.info("Spawning " + Game.creeps[spawn.spawning.name].memory.role);
        }
      }
      else {
        CreepFactory.run();
      }
    }
  }

  // Run creep roles.
  for (const creep of RoomData.creeps) {
    if (!creep.room.controller!.my) {
      creep.notifyWhenAttacked(false);
    }
    else {
      creep.notifyWhenAttacked(true);
    }

    creep.runRole();
  }

  // Clears any non-existing creep memory.
  for (const name in Memory.creeps) {
    const creep: any = Memory.creeps[name];

    if (creep.room === room.name) {
      if (!Game.creeps[name]) {
        if (Config.ENABLE_DEBUG_MODE) {
          log.info("Clearing non-existing creep memory:", name);
        }
        delete Memory.creeps[name];
      }
    }
  }
}

function compileRoomData(room: Room) {
  // Reset data.
  RoomData.reset();

  // Set room.
  RoomData.room = room;

  // Get energy sources.
  RoomData.sources = room.find<Source>(FIND_SOURCES_ACTIVE);

  // Get structures.
  RoomData.structures = room.find<Structure>(FIND_STRUCTURES);
  for (const s of RoomData.structures) {
    switch (s.structureType) {
      case STRUCTURE_ROAD:
        RoomData.roads.push(s as StructureRoad);
        break;
      case STRUCTURE_WALL:
        RoomData.walls.push(s as StructureWall);
        break;
      case STRUCTURE_EXTENSION:
        RoomData.extensions.push(s as Extension);
        break;
      case STRUCTURE_RAMPART:
        RoomData.ramparts.push(s as Rampart);
        break;
      case STRUCTURE_CONTAINER:
        RoomData.containers.push(s as Container);
        break;
      case STRUCTURE_LINK:
        if (s.pos.inRangeTo(RoomData.storage!.pos, 3)) {
          RoomData.storageToLink = s as Link;
        }
        else {
          RoomData.storageFromLink = s as Link;
        }
        break;
      case STRUCTURE_TOWER:
        RoomData.towers.push(s as Tower);
        break;
      case STRUCTURE_STORAGE:
        RoomData.storage = s as Storage;
        break;
      case STRUCTURE_SPAWN:
        RoomData.spawns.push(s as Spawn);
        break;
    }
  }

  // Get construction sites.
  RoomData.sites = room.find<ConstructionSite>(FIND_MY_CONSTRUCTION_SITES);

  // Get creeps.
  RoomData.creeps = room.find<Creep>(FIND_MY_CREEPS);

  // Get hostile creeps.
  RoomData.hostileCreeps = room.find<Creep>(FIND_HOSTILE_CREEPS);

  // Get number of creeps with each role.
  const creepsOfRole = {} as any;
  for (const role of roles) {
    let sum = 0;
    for (const c of RoomData.creeps) {
      if (c.memory.role === role) {
        sum++;
      }
    }
    creepsOfRole[role] = sum;
  }
  RoomData.creepsOfRole = creepsOfRole;
}

const roles = [
  "builder",
  "courier",
  "harvester",
  "healer",
  "invader",
  "longHarvester",
  "miner",
  "rampartRepairer",
  "repairer",
  "scavenger",
  "sentinel",
  "storageKeeper",
  "transporter",
  "upgrader",
  "wallRepairer"
];
