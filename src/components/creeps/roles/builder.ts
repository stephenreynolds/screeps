/**
 * Role: Builder
 * Description: builds structures, or otherwise upgrades controller.
 */

import * as creepActions from "../creepActions";
import * as roleUpgrader from "./upgrader";

export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    construct(creep);
  }
  else if (!creep.memory.working) {
    creepActions.harvest(creep);
  }
}

function construct(creep: Creep) {
  let site: ConstructionSite;
  const target = Game.getObjectById(creep.memory.targetId);

  if (target !== null) {
    site = target as ConstructionSite;
  }
  else {
    site = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES)[0];
  }

  if (site !== undefined) {
    if (creep.build(site) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, site.pos);
    }
  }
  else {
    roleUpgrader.run(creep);
  }
}
