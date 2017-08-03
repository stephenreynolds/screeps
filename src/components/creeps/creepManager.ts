import { log } from "../../lib/logger/log";
import "../prototypes/creep";
import * as Spawn from "../spawn";

export let creeps: Creep[];
export let creepCount: number = 0;

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  clearMemory(room);
  setMinCreeps();

  // Spawn creeps for each spawn.
  for (const spawn in Game.spawns) {
    Spawn.buildMissingCreeps(Game.spawns[spawn]);
  }

  // Run every creep.
  for (const name in Game.creeps) {
    Game.creeps[name].runRole();
  }
}

/**
 * Set the minimum number of creeps for each role for individual spawns.
 */
function setMinCreeps() {
  Game.spawns["Home"].memory.minCreeps = {
    builder: 1,
    courier: 2,
    harvester: 0,
    rampartRepairer: 3,
    repairer: 1,
    transporter: 2,
    upgrader: 3,
    wallRepairer: 1
  };
}

/**
 * Clears non-existent creep memory.
 * @param {Room} room
 */
function clearMemory(room: Room) {
  for (const name in Memory.creeps) {
    const creep: any = Memory.creeps[name];

    if (creep.room === room.name) {
      if (!Game.creeps[name]) {
        log.info("Clearing non-existing creep memory:", name);
        delete Memory.creeps[name];
      }
    }
  }
}
