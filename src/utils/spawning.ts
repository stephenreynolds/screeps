import * as Config from "boilerplate/config/config";
import { log } from "boilerplate/lib/logger/log";

export function createBalancedCreep(spawn: Spawn, energy: number, role: string, parts: string[],
                                    extraMemory?: { [key: string]: any }): string | number {
  let baseCost = 0;
  for (const part of parts) {
    baseCost += BODYPART_COST[part];
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

    if (extraMemory !== undefined) {
      return createCreep(spawn, role, body, extraMemory);
    }
    else {
      return createCreep(spawn, role, body, {});
    }
  }

  return ERR_NOT_ENOUGH_ENERGY;
}

export function createCreep(spawn: Spawn, role: string, body: string[],
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

export function createMiner(spawn: Spawn, sources: Source[], creeps: Creep[],
                            containers: Container[]): string | number {
  let miner: string | number = -99;

  for (const source of sources) {
    if (!_.some(creeps, (c) => c.memory.role === "miner" && c.memory.sourceId === source.id)) {
      const miningContainers = source.pos.findInRange<Structure>(containers, 1);

      if (miningContainers.length > 0) {
        const body: string[] = [MOVE, WORK, WORK];

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

export function printSpawnInfo(spawn: Spawn, constructionSites?: ConstructionSite[]) {
  const upgradePercent = (spawn.room.controller!.progress / spawn.room.controller!.progressTotal) * 100;
  let constructionPercent;
  let site: ConstructionSite | undefined;

  if (constructionSites !== undefined) {
    site = constructionSites[0];

    if (site !== undefined) {
      constructionPercent = (site.progress / site.progressTotal) * 100;
    }
  }

  if (Config.ENABLE_DEBUG_MODE) {
    // Construction and upgrade.
    if (site !== undefined && constructionPercent !== undefined && !isNaN(upgradePercent)) {
      log.info(spawn.room.name + "/" + spawn.name +
        ", Upgrade Progress: " + upgradePercent.toFixed(2) +
        "%, " + _.startCase(_.words(site.structureType).toString()) +
        " Progress: " + constructionPercent.toFixed(2) + "%");
    } // Upgrade
    else if (constructionPercent === undefined && !isNaN(upgradePercent)) {
      log.info(spawn.room.name + "/" + spawn.name +
        ", Upgrade Progress: " + upgradePercent.toFixed(2) + "%");
    } // Construction
    else if (isNaN(upgradePercent) && site !== undefined &&  constructionPercent !== undefined) {
      log.info(spawn.room.name + "/" + spawn.name +
        _.startCase(_.words(site.structureType).toString()) +
        " Progress: " + constructionPercent.toFixed(2) + "%");
    }
    else {
      log.info(spawn.room.name + "/" + spawn.name);
    }
  }
}
