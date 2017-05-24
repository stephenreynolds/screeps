import "./prototypes/tower";

export function run(room: Room) {
  const hostiles = room.find<Creep>(FIND_HOSTILE_CREEPS);

  if (hostiles.length > 0) {
    // Notify if enemy creep spotted.
    const username = hostiles[0].owner.username;
    Game.notify(`User ${username} spotted in room ${room}`);

    // Run towers.
    const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
    for (const tower of towers as StructureTower[]) {
      tower.defend(hostiles[0]);
    }
  }
}
