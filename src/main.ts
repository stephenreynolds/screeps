import * as Config from "config/config";
import * as Report from "report";
import * as RoomManager from "roomManager";
import * as Profiler from "screeps-profiler";

if (Config.USE_PROFILER) {
  Profiler.enable();
}

function main() {
  // Only run the script when the bucket is half full.
  if (Game.cpu.tickLimit < 250) {
    return;
  }

  // Check memory for null or out of bounds custom objects.
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  // Run each room.
  const rooms = [];
  for (const roomName in Game.rooms) {
    rooms.push(Game.rooms[roomName]);
    RoomManager.run(Game.rooms[roomName]);
  }

  // Print report.
  if (Game.time % 20 === 0) {
    Report.run(rooms);
  }

 // Start profiler.
  if (Config.USE_PROFILER) {
    if (Game.time % Config.PROFILE_TICKS) {
      Game.profiler.email(Config.PROFILE_TICKS);
    }
  }
}

export const loop = !Config.USE_PROFILER ? main : () => { Profiler.wrap(main); };
