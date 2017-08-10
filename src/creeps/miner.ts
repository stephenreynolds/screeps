/**
 * Role: Miner
 * Description: Harvests energy from source and drops it into container
 * Parts: MOVE, WORK
 */

import { RoomData } from "roomData";
import { moveTo } from "../creepUtils/creepUtils";

export function run(creep: Creep) {
  const source = Game.getObjectById<Source>(creep.memory.sourceId)!;
  const container = source.pos.findInRange<Structure>(RoomData.containers, 1)[0];

  if (creep.pos.isEqualTo(container)) {
    creep.harvest(source!);
  }
  else {
    moveTo(creep, container.pos);
  }
}
