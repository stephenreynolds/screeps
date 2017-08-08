import { log } from "boilerplate/lib/logger/log";
import { RoomData } from "roomData";
import * as Config from "./boilerplate/config/config";

export function hasResource(structure: any, resource: string) {
  return structure.energy > 0 || structure.store[resource] > 0;
}

export function notFull(structure: any, resource: string) {
  if (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) {
    return structure.store[resource] < structure.storeCapacity;
  }
  else {
    return structure.energy < structure.energyCapacity;
  }
}

export function notFullHealth(object: any) {
  return object.hits < object.hitsMax;
}

export function setDifference(a: any[], b: any[]) {
  return a.filter((x) => b.indexOf(x) < 0);
}

export function printSpawnInfo(spawn: Spawn) {
  const upgradePercent = (spawn.room.controller!.progress / spawn.room.controller!.progressTotal) * 100;
  const site = RoomData.sites[0];
  let constructionPercent;

  if (site !== undefined) {
    constructionPercent = (site.progress / site.progressTotal) * 100;
  }

  if (Config.ENABLE_DEBUG_MODE) {
    // Construction and upgrade.
    if (constructionPercent !== undefined && !isNaN(upgradePercent)) {
      log.info(spawn.room.name + "/" + spawn.name +
        ", Upgrade Progress: " + upgradePercent.toFixed(2) +
        "%, " + _.startCase(_.words(site.structureType).toString()) +
        " Progress: " + constructionPercent.toFixed(2) + "%");
    } // Upgrade
    else if (constructionPercent === undefined && !isNaN(upgradePercent)) {
      log.info(spawn.room.name + "/" + spawn.name +
        ", Upgrade Progress: " + upgradePercent.toFixed(2) + "%");
    } // Construction
    else if (isNaN(upgradePercent) && constructionPercent !== undefined) {
      log.info(spawn.room.name + "/" + spawn.name +
        _.startCase(_.words(site.structureType).toString()) +
        " Progress: " + constructionPercent.toFixed(2) + "%");
    }
    else {
      log.info(spawn.room.name + "/" + spawn.name);
    }
  }
}
