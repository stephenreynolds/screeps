import * as Config from "../../config/config";

import * as builder from "./roles/builder";
import * as harvester from "./roles/harvester";
import * as repairer from "./roles/repairer";
import * as upgrader from "./roles/upgrader";

import { log } from "../../lib/logger/log";

export let creeps: Creep[];
export let creepCount: number = 0;

export let builders: Creep[] = [];
export let harvesters: Creep[] = [];
export let repairers: Creep[] = [];
export let upgraders: Creep[] = [];

const minBuilders = 2;
const minHarvesters = 2;
const minRepairers = 2;
const minUpgraders = 2;

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  loadCreeps(room);
  buildMissingCreeps(room);

  _.each(creeps, (creep: Creep) => {
    if (creep.memory.role === "harvester") {
      harvester.run(creep);
    }
    else if (creep.memory.role === "upgrader") {
      upgrader.run(creep);
    }
    else if (creep.memory.role === "builder") {
      builder.run(creep);
    }
    else if (creep.memory.role === "repairer") {
      repairer.run(creep);
    }
  });
}

/**
 * Loads and counts all available creeps.
 *
 * @param {Room} room
 */
function loadCreeps(room: Room) {
  creeps = room.find<Creep>(FIND_MY_CREEPS);
  creepCount = _.size(creeps);

  // Iterate through each creep and push them into the role array.
  builders = _.filter(creeps, (creep) => creep.memory.role === "builder");
  harvesters = _.filter(creeps, (creep) => creep.memory.role === "harvester");
  repairers = _.filter(creeps, (creep) => creep.memory.role === "repairer");
  upgraders = _.filter(creeps, (creep) => creep.memory.role === "upgrader");

  if (Config.ENABLE_DEBUG_MODE) {
    log.info(creepCount + " creeps found in the playground.");
  }
}

/**
 * Creates a new creep if we still have enough space.
 *
 * @param {Room} room
 */
function buildMissingCreeps(room: Room) {
  let bodyParts: string[];

  const spawns: Spawn[] = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: (spawn: Spawn) => {
      return spawn.spawning === null;
    },
  });

  if (Config.ENABLE_DEBUG_MODE) {
    if (spawns[0]) {
      log.info("Spawn: " + spawns[0].name);
    }
  }

  if (harvesters.length < minHarvesters) {
    if (harvesters.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, WORK, CARRY, MOVE];
    }
    else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: Spawn) => {
      spawnCreep(spawn, bodyParts, "harvester");
    });
  }
  else if (upgraders.length < minUpgraders) {
    if (upgraders.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, CARRY, MOVE, MOVE];
    }
    else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: Spawn) => {
      spawnCreep(spawn, bodyParts, "upgrader");
    });
  }
  else if (builders.length < minBuilders) {
    if (builders.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, CARRY, MOVE, MOVE];
    }
    else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: Spawn) => {
      spawnCreep(spawn, bodyParts, "builder");
    });
  }
  else if (repairers.length < minRepairers) {
    if (repairers.length < 1 || room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, CARRY, MOVE, MOVE];
    }
    else if (room.energyCapacityAvailable > 800) {
      bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }

    _.each(spawns, (spawn: Spawn) => {
      spawnCreep(spawn, bodyParts, "repairer");
    });
  }
}

/**
 * Spawns a new creep.
 *
 * @param {Spawn} spawn
 * @param {string[]} bodyParts
 * @param {string} role
 * @returns
 */
function spawnCreep(spawn: Spawn, bodyParts: string[], role: string) {
  const uuid: number = Memory.uuid;
  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);
  let sources = spawn.room.find<Source>(FIND_SOURCES_ACTIVE);

  const properties: { [key: string]: any } = {
    role,
    room: spawn.room.name,
    sourceId: sources[Math.floor(Math.random() * sources.length)].id,
    working: false
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    const creepName: string = role + uuid;

    log.info("Started creating new creep: " + creepName);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Body: " + bodyParts);
    }

    status = spawn.createCreep(bodyParts, creepName, properties);

    return _.isString(status) ? OK : status;
  }
  else
  {
    if (Config.ENABLE_DEBUG_MODE) {
      switch (status) {
        case -6:
          log.info("Not enough energy to create " + role + ".");
          break;
        case -4:
          log.info("Spawn busy.");
          break;
        case -14:
          log.info("Room Controller level insufficient to use spawn " + spawn + ".");
          break;
        case -10:
          log.info(role + " body is invalid.");
          break;
        case -1:
          log.info("You do not own spawn " + spawn + ".");
          break;
        case -3:
          log.info("Creep with name already exists.");
          break;
        default:
          log.info("Unknown spawn error.");
          break;
      }
    }

    return status;
  }
}
