export function run(room: Room) {
  const hostiles = room.find<Creep>(FIND_HOSTILE_CREEPS);

  if (hostiles.length > 0) {
    // Run towers.
    const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
    for (const tower of towers as StructureTower[]) {
      tower.attack(hostiles[0]);
    }

    // Order spawning of sentinels.
    room.memory.sentinels = hostiles.length * 2;
    room.memory.healers = Math.ceil(room.memory.sentinels / 4);
  }
  else {
    room.memory.sentinels = 0;
    room.memory.healers = 0;
  }
}
