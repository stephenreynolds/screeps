/**
 * Role: Invader
 * Description: melee creep attacks spawns and structures; creeps when close.
 */

import { RoomData } from "roomData";
import { moveTo, moveToRoom } from "../creepUtils/creepUtils";

export function run(creep: Creep) {
  const targetRoom = Game.rooms[creep.memory.targetRoom];

  let hostileNear;

  for (const h of RoomData.hostileCreeps) {
    if (creep.pos.isNearTo(h)) {
      hostileNear = h;
      break;
    }
  }

  if (creep.room !== targetRoom) {
    moveToRoom(creep, targetRoom);
  }
  else {
    if (hostileNear !== undefined) {
      creep.attack(hostileNear);
    }
    else {
      const spawn = creep.pos.findClosestByPath(creep.room.find<Spawn>(FIND_HOSTILE_SPAWNS));
      const structures = targetRoom.find<Structure>(FIND_HOSTILE_STRUCTURES);

      if (spawn !== undefined && creep.attack(spawn) === ERR_NOT_IN_RANGE) {
        moveTo(creep, spawn.pos);
      }

      if (spawn === undefined && RoomData.hostileCreeps === undefined && structures === undefined
        && targetRoom.controller!.level === 0) {
        creep.room.memory.invadeRoom = undefined;
      }
      else {
        const attackCreep = Math.random() >= 0.5;
        const targetCreep = Game.getObjectById(creep.memory.targetCreep) as Creep;

        if (RoomData.hostileCreeps.length > 0 && targetCreep === undefined && attackCreep) {
          creep.memory.targetCreep = RoomData.hostileCreeps[0].id;
        }
        else if (targetCreep !== undefined) {
          creep.memory.targetCreep = null;
        }

        if (targetCreep !== null) {
          if (creep.attack(targetCreep) === ERR_NOT_IN_RANGE) {
            moveTo(creep, targetCreep.pos);
          }
        }
        else {
          if (structures[1] !== undefined) {
            if (creep.attack(structures[1]) === ERR_NOT_IN_RANGE) {
              moveTo(creep, structures[1].pos);
            }
          }
          else {
            moveTo(creep, Game.flags[targetRoom + "-UF"].pos);
          }
        }
      }
    }
  }
}
