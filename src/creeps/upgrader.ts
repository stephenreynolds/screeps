/**
 * Role: Upgrader
 * Description: Upgrades controller
 */

import { log } from "boilerplate/lib/logger/log";
import { moveTo } from "../creepUtils/creepUtils";
import { getEnergy } from "../creepUtils/getResource";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const flag = Game.flags[creep.memory.home + "-UF"] as Flag;

    if (flag !== undefined) {
      if (creep.pos.inRangeTo(flag, 2)) {
        upgrade(creep);
      }
      else {
        moveTo(creep, flag.pos);
      }
    }
    else {
      log.error("Upgrade flag not found!");
    }
  }
  else if (!creep.memory.working) {
    getEnergy(creep);
  }
}

function upgrade(creep: Creep) {
  const controller = creep.room.controller as Controller;

  if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
    moveTo(creep, controller.pos);
  }
}
