export function moveTo(creep: Creep, target: RoomPosition) {
  creep.memory.moveTarget = target;
  creep.moveTo(creep.memory.moveTarget, {
    reusePath: 7, visualizePathStyle: {
      fill: "transparent",
      lineStyle: "dashed",
      opacity: .1,
      stroke: "#fff",
      strokeWidth: .15
    }
  });
}

export function moveToRoom(creep: Creep, destination: Room) {
  const route = Game.map.findRoute(creep.room, destination) as Array<{ exit: number, room: string }>;
  if (route.length > 0) {
    const exit = creep.pos.findClosestByRange(route[0].exit) as RoomPosition;
    moveTo(creep, exit);
  }
}

export function constructSite(creep: Creep, site: ConstructionSite) {
  if (creep.room !== site.room) {
    moveToRoom(creep, site.room!);
  }
  else if (creep.build(site) === ERR_NOT_IN_RANGE) {
    moveTo(creep, site.pos);
  }
}
