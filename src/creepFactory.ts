import { RoomData } from "roomData";
import { printSpawnInfo } from "utils";

let spawn: Spawn;

export function run(s: Spawn) {
  spawn = s;

  const creepsOfRole = RoomData.creepsOfRole as any;

  printSpawnInfo(spawn);
}
