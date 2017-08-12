import { createCreep, printSpawnInfo } from "utils/spawning";
import { RoomData } from "./roomData";

export function run() {
  const creepsOfRole = RoomData.creepsOfRole as any;
  printSpawnInfo(RoomData.spawn);

  if (creepsOfRole["upgrader"] < 1) {
    createCreep(RoomData.spawn, "upgrader", [WORK, CARRY, MOVE]);
  }
  else if (creepsOfRole["harvester"] < 1) {
    createCreep(RoomData.spawn, "harvester", [WORK, CARRY, MOVE]);
  }
}
