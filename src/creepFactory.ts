import * as Config from "config/config";
import { log } from "lib/logger/log";
import { RoomData } from "./roomData";

export function run() {
  const creepsOfRole = RoomData.creepsOfRole as any;

  const spawn = getSpawn();

  if (spawn === undefined) {
    return;
  }

  if (creepsOfRole["courier"] < RoomData.sources.length) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "courier", [WORK, CARRY, MOVE], [2, 3, 3]);
  }
  else if (creepsOfRole["sentinel"] < RoomData.room.memory.sentinels) {
    createCreep(spawn, "sentinel", [ATTACK, ATTACK, MOVE, MOVE]);
  }
  else if (creepsOfRole["healer"] < RoomData.room.memory.healer) {
    createCreep(spawn, "healer", [HEAL, MOVE]);
  }
  else if (creepsOfRole["miner"] < RoomData.containers.length) {
    createMiner(spawn, RoomData.sources, RoomData.creeps, RoomData.containers);
  }
  else if (creepsOfRole["upgrader"] < 2) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "upgrader", [WORK, WORK, CARRY, MOVE], [4, 4, 2, 2]);
  }
  else if (creepsOfRole["storageKeeper"] < 1 && RoomData.storage !== undefined &&
    RoomData.storageToLink !== undefined && RoomData.storageFromLink !== undefined) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "storageKeeper", [WORK, WORK, CARRY, MOVE], [2, 2, 1, 1]);
  }
  else if ((RoomData.storageFromLink !== undefined && RoomData.storageToLink !== undefined
    && creepsOfRole["transporter"] < RoomData.containers.length - 1) ||
    (RoomData.storageFromLink === undefined || RoomData.storageToLink === undefined
      && creepsOfRole["transporter"] < RoomData.containers.length) && RoomData.storage !== undefined) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "transporter", [CARRY, CARRY, MOVE, MOVE], [3, 3, 2, 2]);
  }
  else if (creepsOfRole["builder"] < 3 && RoomData.sites.length > 0) {
    if (Game.getObjectById(RoomData.room.memory.construct) !== undefined) {
      createBalancedCreep(spawn, RoomData.room.energyAvailable, "builder",
        [WORK, CARRY, MOVE], [3, 3, 3], { targetId: RoomData.room.memory.construct });
    }
    else {
      RoomData.room.memory.construct = undefined;
      createBalancedCreep(spawn, RoomData.room.energyAvailable, "builder", [WORK, CARRY, MOVE], [3, 3, 3]);
    }
  }
  else if (creepsOfRole["repairer"] < 1) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "repairer", [WORK, CARRY, MOVE], [2, 2, 3]);
  }
  else if (creepsOfRole["rampartRepairer"] < 1) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "rampartRepairer", [WORK, CARRY, MOVE], [3, 3, 3]);
  }
  else if (creepsOfRole["wallRepairer"] < 1) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "wallRepairer", [WORK, CARRY, MOVE], [3, 3, 3]);
  }
  else if (RoomData.room.memory.colony !== undefined && RoomData.longHarvesterCount < 2) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable,
      "longHarvester", [WORK, CARRY, CARRY, MOVE, MOVE], [2, 4, 4, 3, 3], { targetRoom: RoomData.room.memory.colony });
  }
  else if (creepsOfRole["scavenger"] < 1) {
    createCreep(spawn, "scavenger", [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]);
  }
  else if (RoomData.room.memory.invadeRoom !== undefined && RoomData.invaderCount < 10) {
    createBalancedCreep(spawn, RoomData.room.energyAvailable, "invader",
      [ATTACK, MOVE, TOUGH, TOUGH], [3, 3, 3, 3], { targetRoom: RoomData.room.memory.invadeRoom });
  }
}

function createBalancedCreep(spawn: Spawn, energy: number, role: string, parts: string[], max?: number[],
                             extraMemory?: { [key: string]: any }): string | number {
  let baseCost = 0;
  for (const part of parts) {
    baseCost += BODYPART_COST[part];
  }

  if (energy < baseCost) {
    if (Config.ENABLE_DEBUG_MODE) {
      log.info(`Not enough energy to create ${role}.`);
    }
  }
  else {
    const numberOfParts =
      Math.min(Math.floor(energy / baseCost), Math.floor(50 / parts.length));

    const body = [];
    for (const part of parts) {
      for (let i = 0; i < numberOfParts; i++) {
        const num = _.filter(body, (p: string) => p === part).length;
        if (max !== undefined && num >= max[parts.indexOf(part)]) {
          break;
        }

        body.push(part);
      }
    }

    if (extraMemory !== undefined) {
      return createCreep(spawn, role, body, extraMemory);
    }
    else {
      return createCreep(spawn, role, body, {});
    }
  }

  return ERR_NOT_ENOUGH_ENERGY;
}

function createCreep(spawn: Spawn, role: string, body: string[],
                     extraMemory?: { [key: string]: any }): number | string {
  const uuid: number = Memory.uuid;
  const name: string = role + uuid;

  const memory: { [key: string]: any } = {
    home: spawn.room.name,
    role,
    targetId: null,
    working: false
  };

  Object.assign(memory, extraMemory);

  let status: number | string = spawn.canCreateCreep(body, name);
  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;

    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Started creating new creep: " + name);
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

function createMiner(spawn: Spawn, sources: Source[], creeps: Creep[],
                     containers: Container[]): string | number {
  let miner: string | number = -99;

  for (const source of sources) {
    if (!_.some(creeps, (c) => c.memory.role === "miner" && c.memory.sourceId === source.id)) {
      const miningContainers = source.pos.findInRange<Structure>(containers, 1);

      if (miningContainers.length > 0) {
        const body: string[] = [MOVE, CARRY, WORK, WORK];

        for (let i = 1; i <= (spawn.room.energyAvailable - 250) / 100 && i <= 3; i++) {
          body.push(WORK);
        }

        const properties: { [key: string]: any } = {
          sourceId: source.id
        };

        miner = createCreep(spawn, "miner", body, properties);
        break;
      }
    }
  }

  return miner;
}

function getSpawn() {
  for (const spawn of RoomData.spawns) {
    if (!spawn.spawning) {
      return spawn;
    }
  }
}
