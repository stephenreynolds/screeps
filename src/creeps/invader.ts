import { moveTo, moveToRoom } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  let hostileNear;

  for (const h of RoomData.hostileCreeps) {
    if (creep.pos.isNearTo(h)) {
      hostileNear = h;
      break;
    }
  }

  if (creep.room.name !== creep.memory.targetRoom || creep.pos.x * creep.pos.y === 0 ||
    Math.abs(creep.pos.x) === 49 || Math.abs(creep.pos.y) === 49) {
    moveToRoom(creep, creep.memory.targetRoom);
  }
  else {
    if (hostileNear !== undefined) {
      creep.attack(hostileNear);
    }
    else {
      const spawn = creep.pos.findClosestByPath(creep.room.find<Spawn>(FIND_HOSTILE_SPAWNS));

      if (spawn !== undefined && creep.attack(spawn) === ERR_NOT_IN_RANGE) {
        moveTo(creep, spawn.pos);
      }
      else if (Game.rooms[creep.memory.home].memory.invadeRoom !== undefined) {
        // Attack creeps if spawns are gone.
        const hostileCreep = creep.pos.findClosestByPath(RoomData.hostileCreeps);

        if (hostileCreep !== null) {
          if (creep.attack(hostileCreep) === ERR_NOT_IN_RANGE) {
            moveTo(creep, hostileCreep.pos);
          }
        }
        else {
          // Attack structures if creeps are also gone.
          const structures = _.filter(creep.room.find<Structure>(FIND_HOSTILE_STRUCTURES), (s: Structure) => {
            return s.structureType !== STRUCTURE_CONTROLLER;
          });

          if (structures[0] !== undefined) {
            if (creep.attack(structures[0]) === ERR_NOT_IN_RANGE) {
              moveTo(creep, structures[0].pos);
            }
          }
          else {
            delete Game.rooms[creep.memory.home].memory.invadeRoom;
          }
        }
      }
    }
  }
}
