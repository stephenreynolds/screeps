import * as rcl0 from "rclScripts/rcl0/roomManager";
import * as rcl1 from "rclScripts/rcl1/roomManager";
import * as rcl2 from "rclScripts/rcl2/roomManager";
import * as rcl3 from "rclScripts/rcl3/roomManager";
import * as rcl4 from "rclScripts/rcl4/roomManager";
import * as rcl5 from "rclScripts/rcl5/roomManager";
// import * as rcl6 from "rclScripts/rcl6/roomManager";
// import * as rcl7 from "rclScripts/rcl7/roomManager";
// import * as rcl8 from "rclScripts/rcl8/roomManager";
import * as Profiler from "screeps-profiler";
import * as Config from "./boilerplate/config/config";

if (Config.USE_PROFILER) {
  Profiler.enable();
}

function main() {
  // Check memory for null or out of bounds custom objects.
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  for (const r in Game.rooms) {
    const room = Game.rooms[r];
    switch (room.controller!.level) {
      case 0:
        rcl0.run(room);
        break;
      case 1:
        rcl1.run(room);
        break;
      case 2:
        rcl2.run(room);
        break;
      case 3:
        rcl3.run(room);
        break;
      case 4:
        rcl4.run(room);
        break;
      case 5:
        rcl5.run(room);
        break;
      // case 6:
      //   rcl6.run(room);
      //   break;
      // case 7:
      //   rcl7.run(room);
      //   break;
      // case 8:
      //   rcl8.run(room);
      //   break;
    }
  }
}

export const loop = !Config.USE_PROFILER ? main : () => { Profiler.wrap(main); };
