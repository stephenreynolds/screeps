/**
 * Role: Upgrader
 * Description: upgrades controller.
 */

import * as creepActions from "../creepActions";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    const flag = Game.flags[creep.room.name + "-UF"] as Flag;

    if (creep.pos.inRangeTo(flag, 2)) {
      upgrade(creep);
    }
    else {
      creepActions.moveTo(creep, flag.pos);
    }
  }
  else if (!creep.memory.working) {
    creepActions.harvest(creep);
  }
}

function upgrade(creep: Creep) {
  const controller = creep.room.controller as Controller;

  if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, controller.pos);
  }
}
