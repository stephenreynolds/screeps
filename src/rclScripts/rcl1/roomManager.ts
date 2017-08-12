import { log } from "boilerplate/lib/logger/log";
import "creepPrototype";
import { printSpawnInfo } from "utils/spawning";
import * as CreepFactory from "./creepFactory";
import { RoomData } from "./roomData";
import * as StructureManager from "./structureManager";

export function run(room: Room) {
  // Compile room data.
  compileRoomData(room);

  StructureManager.run();

  if (room.controller!.my) {
    // Run spawn.
    if (RoomData.spawn !== undefined) {
      if (RoomData.spawn.spawning) {
        printSpawnInfo(RoomData.spawn);
        log.info("Spawning " + Game.creeps[RoomData.spawn.spawning.name].memory.role);
      }
      else {
        CreepFactory.run();
      }
    }
  }

  // Run creep roles.
  for (const creep of RoomData.creeps) {
    creep.runRole();
  }

  // Clears any non-existing creep memory.
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

function compileRoomData(room: Room) {
  // Reset data.
  RoomData.reset();

  // Set room.
  RoomData.room = room;

  // Get energy sources.
  RoomData.sources = room.find<Source>(FIND_SOURCES_ACTIVE);

  // Get structures.
  RoomData.spawn = room.find<Spawn>(FIND_MY_SPAWNS)[0];

  // Get creeps.
  RoomData.creeps = room.find<Creep>(FIND_MY_CREEPS);

  // Get number of creeps with each role.
  const creepsOfRole = {} as any;
  for (const role of roles) {
    let sum = 0;
    for (const c of RoomData.creeps) {
      if (c.memory.role === role) {
        sum++;
      }
    }
    creepsOfRole[role] = sum;
  }
  RoomData.creepsOfRole = creepsOfRole;
}

const roles = [
  "harvester",
  "upgrader",
];
