import * as creepActions from "../creepActions";

export function run(creep: Creep) {
  const source = Game.getObjectById<Source>(creep.memory.sourceId)!;
  const container = source.pos.findInRange<Structure>(FIND_STRUCTURES, 1, {
    filter: (s: Structure) => {
      return s.structureType === STRUCTURE_CONTAINER;
    }
  })[0];

  if (creep.pos.isEqualTo(container)) {
    creep.harvest(source!);
  }
  else {
    creepActions.moveTo(creep, container.pos);
  }
}
