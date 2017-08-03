import * as Config from "../config/config";
import { log } from "../lib/logger/log";

const roles = [
  "builder",
  "claimer",
  "courier",
  "harvester",
  "healer",
  "miner",
  "rampartRepairer",
  "repairer",
  "sentinel",
  "transporter",
  "upgrader",
  "wallRepairer"
];

let spawn: Spawn;

export function buildMissingCreeps(s: Spawn) {
  spawn = s;

  // Do nothing if spawn is busy.
  if (spawn.spawning)
  {
    return;
  }

  // Get number of creeps with each role.
  const creepsInRoom = spawn.room.find(FIND_MY_CREEPS) as Creep[];
  const numberOfCreeps = {} as any;
  for (const role of roles) {
    let sum = 0;
    for (const c of creepsInRoom) {
      if (c.memory.role === role) {
        sum++;
      }
    }
    numberOfCreeps[role] = sum;
  }

  // Log spawn name.
  if (Config.ENABLE_DEBUG_MODE) {
    log.info("Spawn: " + spawn.name);
  }

  const containers = spawn.room.find<Structure>(FIND_STRUCTURES, {
    filter: (st: Structure) => {
      return st.structureType === STRUCTURE_CONTAINER;
    }
  });

  const storage = spawn.room.find<Storage>(FIND_MY_STRUCTURES, {
    filter: (st: Storage) => {
      return st.structureType === STRUCTURE_STORAGE && st.store[RESOURCE_ENERGY]! > 0;
    }
  });

  // Transporter
  if (numberOfCreeps["harvester"] === 0 && (numberOfCreeps["miner"] === 0 ||
        numberOfCreeps["transporter"] < spawn.memory.minCreeps["transporter"])) {
      if (numberOfCreeps["miner"] > 0) {
        createBalancedCreep(spawn.room.energyAvailable, "transporter", [CARRY, MOVE, MOVE]);
      }
      else {
        createBalancedCreep(
          spawn.room.energyAvailable, "harvester", [WORK, CARRY, MOVE]);
      }
  } // Courier
  else if (numberOfCreeps["courier"] < spawn.memory.minCreeps["courier"] && storage.length > 0) {
    createBalancedCreep(spawn.room.energyAvailable, "courier", [CARRY, MOVE, MOVE]);
  } // Miner
  else if (numberOfCreeps["miner"] < containers.length) {
    createMiner();
  } // Harvester
  else if (numberOfCreeps["harvester"] < spawn.memory.minCreeps["harvester"]) {
    createBalancedCreep(
      spawn.room.energyAvailable, "harvester", [WORK, CARRY, MOVE]);
  } // Sentinel
  else if (numberOfCreeps["sentinel"] < spawn.room.memory.sentinels) {
    createCreep([ATTACK, ATTACK, ATTACK, MOVE, MOVE], "sentinel", {});
  } // Healer
  else if (numberOfCreeps["healer"] < spawn.room.memory.healers) {
    createCreep([HEAL, MOVE], "healer", {});
  } // Claimer
  else if (spawn.memory.claimRoom !== undefined) {
    const name = createClaimer();

    if (!(name < 0)) {
      delete spawn.memory.claimRoom;
    }
  } // Upgrader
  else if (numberOfCreeps["upgrader"] < spawn.memory.minCreeps["upgrader"]) {
    createBalancedCreep(
      spawn.room.energyAvailable, "upgrader", [WORK, CARRY, MOVE]);
  } // Builder
  else if (numberOfCreeps["builder"] < spawn.memory.minCreeps["builder"]) {
    createBalancedCreep(
      spawn.room.energyAvailable, "builder", [WORK, CARRY, MOVE]);
  } // Rampart Repairer
  else if (numberOfCreeps["rampartRepairer"] < spawn.memory.minCreeps["rampartRepairer"]) {
    createBalancedCreep(
      spawn.room.energyAvailable, "rampartRepairer", [WORK, CARRY, MOVE]);
  } // Wall Repairer
  else if (numberOfCreeps["wallRepairer"] < spawn.memory.minCreeps["wallRepairer"]) {
    createBalancedCreep(
      spawn.room.energyAvailable, "wallRepairer", [WORK, CARRY, MOVE]);
  } // Repairer
  else if (numberOfCreeps["repairer"] < spawn.memory.minCreeps["repairer"]) {
    createBalancedCreep(
      spawn.room.energyAvailable, "repairer", [WORK, CARRY, MOVE]);
  }
}

/**
 * Create a creep with an equal number of each of its parts.
 * @param energy
 * @param role
 * @param parts
 */
function createBalancedCreep(energy: number, role: string, parts: string[]) {
    let baseCost = 0;
    for (const part of parts) {
      baseCost += BODYPART_COST[part];
    }

    // Balanced creep may be made with at most 1000 energy.
    if (baseCost > 1000) {
      baseCost = 1000;
    }

    if (energy < baseCost) {
      log.info(`Not enough energy to create ${role}.`);
    }
    else {
      const numberOfParts =
        Math.min(Math.floor(energy / baseCost), Math.floor(50 / parts.length));

      const body = [];
      for (const part of parts) {
        for (let i = 0; i < numberOfParts; i++) {
          body.push(part);
        }
      }

      return createCreep(body, role, {});
    }
}

/**
 * Create a creep with given body, role, and additional memory.
 * @param body
 * @param role
 * @param extraMemory
 */
function createCreep(body: string[], role: string, extraMemory: { [key: string]: any }): number | string {
  const uuid: number = Memory.uuid;
  const name: string = role + uuid;

  const memory: { [key: string]: any } = {
    role,
    room: spawn.room.name,
    targetId: null,
    working: false
  };

  Object.assign(memory, extraMemory);

  let status: number | string = spawn.canCreateCreep(body, name);
  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;

    log.info("Started creating new creep: " + name);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Body: " + body);
    }

    status = spawn.createCreep(body, name, memory);

    return _.isString(status) ? OK : status;
  }
  else {
    if (Config.ENABLE_DEBUG_MODE) {
      switch (status) {
        case ERR_NOT_ENOUGH_ENERGY:
          log.info(`Not enough energy to create ${role}.`);
          break;
        case ERR_RCL_NOT_ENOUGH:
          log.info(`Room Controller level insufficient to use spawn ${spawn}`);
          break;
        case ERR_INVALID_ARGS:
          log.error(`${role} body is invalid.`);
          break;
        case ERR_NOT_OWNER:
          log.info(`You do not own spawn ${spawn}`);
          break;
        case ERR_NAME_EXISTS:
          log.info(`Creep with name ${name} already exists.`);
          break;
      }
    }

    return status;
  }
}

/**
 * Create a claimer creep.
 */
function createClaimer(): string | number {
  const body = [WORK, CARRY, MOVE, CLAIM];

  const properties: { [key: string]: any } = {
    targetFlag: spawn.memory.claimRoom
  };

  return createCreep(body, "claimer", properties);
}

function createMiner(): string | number {
  let miner: string | number = -99;
  const creepsInRoom = spawn.room.find(FIND_MY_CREEPS) as Creep[];

  for (const source of spawn.room.find<Source>(FIND_SOURCES_ACTIVE)) {
    if (!_.some(creepsInRoom, (c) => c.memory.role === "miner" && c.memory.sourceId === source.id)) {
      const containers = source.pos.findInRange<Structure>(FIND_STRUCTURES, 1, {
        filter: (s: Structure) => {
          return s.structureType === STRUCTURE_CONTAINER;
        }
      });

      if (containers.length > 0) {
        const body: string[] = [MOVE, WORK, WORK];

        for (let i = 1; i <= (spawn.room.energyAvailable - 250) / 100 && i <= 3; i++) {
          body.push(WORK);
        }

        const properties: { [key: string]: any} = {
          sourceId: source.id
        };

        miner = createCreep(body, "miner", properties);
        break;
      }
    }
  }

  return miner;
}
