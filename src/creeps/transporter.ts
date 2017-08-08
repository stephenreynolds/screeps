/**
 * Role: Transporter
 * Description: Withdraws energy from mining containers and transfers to storage
 * Fallback: Harvester
 */

import { RoomData } from "roomData";
import { moveTo } from "../creepUtils/creepUtils";
import { getResourceFromContainer } from "../creepUtils/getResource";
import * as roleHarvester from "./harvester";

/**
 *
 * @param creep
 */
export function run(creep: Creep): void {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }

  if (creep.memory.working) {
    transfer(creep);
  }
  else if (!creep.memory.working) {
    getResourceFromContainer(creep, RESOURCE_ENERGY);
  }
}

function transfer(creep: Creep) {
  const structure = RoomData.storage;

  if (structure !== undefined) {
    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      moveTo(creep, structure.pos);
    }
  }
  else {
    roleHarvester.run(creep);
  }
}
