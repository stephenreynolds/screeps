import { log } from "boilerplate/lib/logger/log";
import { RoomData } from "roomData";
import { printSpawnInfo } from "utils";
import * as CreepFactory from "./creepFactory";
import * as DefenseManager from "./defenseManager";
import "./prototypes/creep";
import * as Stats from "./stats";

export function run(room: Room) {
  // Initialize room profile.
  const profiler = {
    builder: 0,
    claimer: 0,
    compile: 0,
    courier: 0,
    defense: 0,
    harvester: 0,
    healer: 0,
    invader: 0,
    invaders: 0,
    miner: 0,
    prepare: 0,
    rampartRepairer: 0,
    repairer: 0,
    reserver: 0,
    scavenger: 0,
    sentinel: 0,
    spawning: 0,
    transporter: 0,
    upgrader: 0,
    wallRepairer: 0
  } as any;
  profiler.prepare = Game.cpu.getUsed();

  // Compile room data.
  compileRoomData(room);
  profiler.compile = Game.cpu.getUsed() - profiler.prepare;

  if (room.controller!.my) {
    // Run room defense.
    DefenseManager.run();
    profiler.defense = Game.cpu.getUsed() - _.sum(profiler);

    // Keep track of invaders.
    if (room.memory.invadeRoom !== undefined) {
      const invaded = Game.rooms[room.memory.invadeRoom];
      if (invaded !== undefined) {
        RoomData.invaderCount = _.filter(invaded.find<Creep>(FIND_MY_CREEPS), (c: Creep) => {
          return c.memory.role === "invader";
        }).length;
      }
    }
    profiler.invaders = Game.cpu.getUsed() - _.sum(profiler);

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
    profiler.spawning = Game.cpu.getUsed() - _.sum(profiler);
  }

  // Run creep roles.
  for (const creep of RoomData.creeps) {
    const role = creep.memory.role;
    creep.runRole();
    profiler[role] += Game.cpu.getUsed() - _.sum(profiler);
  }

  // Update room profile.
  Stats.room(profiler);
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
      case STRUCTURE_LINK:
        RoomData.links.push(s as Link);
        break;
      case STRUCTURE_POWER_SPAWN:
        RoomData.powerSpawn = s as PowerSpawn;
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
  if (room.memory.reserveRoom !== undefined) {
    const reserved = Game.rooms[room.memory.reserveRoom];
    if (reserved !== undefined) {
      const reservers = reserved.find<Creep>(FIND_MY_CREEPS);
      creepsOfRole["reserver"] += _.filter(reservers, (c: Creep) => {
          return c.memory.role === "reserver";
      }).length;
    }
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
  "reserver",
  "scavenger",
  "sentinel",
  "transporter",
  "upgrader",
  "wallRepairer"
];
