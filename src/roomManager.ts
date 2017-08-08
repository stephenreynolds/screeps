import { log } from "boilerplate/lib/logger/log";
import { RoomData } from "roomData";
import { printSpawnInfo } from "utils";
import * as CreepFactory from "./creepFactory";
import * as DefenseManager from "./defenseManager";
import "./prototypes/creep";

export function run(room: Room) {
  compileRoomData(room);

  if (room.controller!.my) {
    DefenseManager.run();

    // Check invasion status.
    if (room.memory.invadeRoom !== undefined) {
      // Stop invasion if controller is now inactive.
      const invaded = Game.rooms[room.memory.invadeRoom];
      if (invaded.controller!.level === 0) {
        delete room.memory.invadeRoom;
      }

      // Keep track of invaders.
      RoomData.invaderCount = _.filter(invaded.find<Creep>(FIND_MY_CREEPS), (c: Creep) => {
        return c.memory.role === "invader";
      }).length;
    }

    // Run each spawn.
    for (const spawn of RoomData.spawns) {
      // Do nothing if spawn is busy.
      if (spawn.spawning) {
        printSpawnInfo(spawn);
        log.info("Spawning " + Game.creeps[spawn.spawning.name].memory.role);
        continue;
      }

      CreepFactory.buildMissingCreep(spawn);
    }
  }

  // Run creep roles.
  for (const creep of RoomData.creeps) {
    creep.runRole();
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
      case STRUCTURE_SPAWN:
        RoomData.spawns.push(s as Spawn);
        break;
      case STRUCTURE_STORAGE:
        RoomData.storage = s as Storage;
        break;
      case STRUCTURE_CONTAINER:
        RoomData.containers.push(s as Container);
        break;
      case STRUCTURE_WALL:
        RoomData.walls.push(s as StructureWall);
        break;
      case STRUCTURE_RAMPART:
        RoomData.ramparts.push(s as Rampart);
        break;
      case STRUCTURE_TOWER:
        RoomData.towers.push(s as Tower);
        break;
      default:
        break;
    }
  }

  // Get construction sites.
  RoomData.sites = room.find<ConstructionSite>(FIND_MY_CONSTRUCTION_SITES);

  // Get minerals.
  RoomData.minerals = room.find<Mineral>(FIND_MINERALS);

  // Get dropped resources.
  RoomData.dropped = room.find<Resource>(FIND_DROPPED_RESOURCES);

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
  "claimer",
  "courier",
  "harvester",
  "healer",
  "invader",
  "miner",
  "mineralMiner",
  "rampartRepairer",
  "repairer",
  "scavenger",
  "sentinel",
  "transporter",
  "upgrader",
  "wallRepairer"
];
