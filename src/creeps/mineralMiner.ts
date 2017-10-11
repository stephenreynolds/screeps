import { RoomData } from "../roomData";

export function run(creep: Creep) {
  const mineral = Game.getObjectById<Mineral>(creep.memory.mineralId)!;
  const container = mineral.pos.findInRange<Container>(RoomData.containers, 1)[0];

  if (container !== undefined) {
    if (creep.pos.isEqualTo(container)) {
      creep.harvest(mineral!);
    }
    else {
      creep.moveToTarget(container.pos);
    }
  }
}
