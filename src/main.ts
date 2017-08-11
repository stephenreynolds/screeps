import { log } from "boilerplate/lib/logger/log";
import * as Profiler from "screeps-profiler";
import * as Config from "./boilerplate/config/config";
import * as MinCreeps from "./minCreeps";
import * as RoomManager from "./roomManager";

if (Config.USE_PROFILER) {
  Profiler.enable();
}

function main() {
  clearMemory();
  setMinCreeps();

  for (const room in Game.rooms) {
    RoomManager.run(Game.rooms[room]);
  }
}

function clearMemory() {
  // Check memory for null or out of bounds custom objects.
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  let spawning = false;

  for (const spawn in Game.spawns) {
    if (Game.spawns[spawn].spawning) {
      spawning = true;
      break;
    }
  }

  if (!spawning) {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        log.info("Clearing non-existing creep memory:", name);
        delete Memory.creeps[name];
      }
    }
  }
}

function setMinCreeps() {
  Game.rooms["W18S12"].memory.minCreeps = MinCreeps.W18S12;
  Game.rooms["W18S13"].memory.minCreeps = MinCreeps.W18S13;
}

export const loop = !Config.USE_PROFILER ? main : () => { Profiler.wrap(main); };
