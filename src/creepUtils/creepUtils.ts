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

export function moveToRoom(creep: Creep, roomName: string) {
  moveTo(creep, Game.flags[roomName + "-NAV"].pos);
}
