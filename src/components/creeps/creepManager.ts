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

  // Move creeps with cached paths.
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.moveTo(creep.memory.moveTarget, {reusePath: 50, noPathFinding: true});
  }

  // Move creeps with pathfinding if enough CPU.
  if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      creep.moveTo(creep.memory.moveTarget, {reusePath: 50});
    }
  }
}

/**
 * Set the minimum number of creeps for each role for individual spawns.
 */
function setMinCreeps() {
  Game.spawns["Spawn1"].memory.minCreeps = {
    builder: 6,
    claimer: 0,
    harvester: 5,
    rampartRepairer: 2,
    repairer: 2,
    upgrader: 6,
    wallRepairer: 2
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
