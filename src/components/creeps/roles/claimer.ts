/**
 * Role: Harvester
 * Description: transfers energy to structures which need it.
 */

import * as creepActions from "../creepActions";
import * as roleHarvester from "./harvester";

export function run(creep: Creep) {
  const controller = Game.rooms[creep.memory.targetRoom].controller as StructureController;

  if (controller.my) {
    roleHarvester.run(creep);
  }
  else if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, controller.pos);
  }
}
