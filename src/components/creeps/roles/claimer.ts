/**
 * Role: Harvester
 * Description: transfers energy to structures which need it.
 */

import * as creepActions from "../creepActions";
import * as roleUpgrader from "./upgrader";

export function run(creep: Creep) {
  const targetFlag = Game.flags[creep.memory.targetFlag + "-UF"] as Flag;
  const controller = creep.room.controller as StructureController;

  if (creep.room !== targetFlag.room) {
    creepActions.moveTo(creep, targetFlag.pos);
  }
  else if (controller.my) {
    roleUpgrader.run(creep);
  }
  else {
    switch (creep.claimController(controller)) {
      case ERR_NOT_IN_RANGE:
        creepActions.moveTo(creep, controller.pos);
        break;
      case ERR_GCL_NOT_ENOUGH:
        creep.reserveController(controller);
        break;
    }
  }
}
