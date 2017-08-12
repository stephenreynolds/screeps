import { RoomData } from "./roomData";

export function run() {
  const roomPlan = require("rooms/rcl1/" + RoomData.room.name);

  if (RoomData.spawn === undefined) {
    const pos = roomPlan.room["buildings"]["spawn"]["pos"][0];
    RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_SPAWN);
  }
}
