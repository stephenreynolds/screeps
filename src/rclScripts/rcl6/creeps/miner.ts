/**
 * Role: Miner
 * Description: Harvests energy from source and drops it into container
 * Parts: MOVE, WORK
 */

import { moveTo } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  const source = Game.getObjectById<Source>(creep.memory.sourceId)!;
  const container = source.pos.findInRange<Structure>(RoomData.containers, 1)[0];

  if (container !== undefined) {
    if (creep.pos.isEqualTo(container)) {
      creep.harvest(source!);
    }
    else {
      moveTo(creep, container.pos);
    }
  }
}
