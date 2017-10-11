import * as Config from "config/config";
import * as CreepFactory from "creepFactory";
import "creepPrototype";
import * as DefenseManager from "defenseManager";
import * as JobManager from "jobManager";
import { log } from "lib/logger/log";
import { RoomData } from "roomData";
import * as StructureManager from "structureManager";

export function run(room: Room) {
  // Compile room data.
  compileRoomData(room);

  if (room.controller!.my) {
    DefenseManager.run();
    if (Game.time % 30 === 0) {
      StructureManager.run();
    }
    JobManager.run(room, RoomData.structures, RoomData.sites);

    // Keep track of invaders.
    if (room.memory.invadeRoom !== undefined) {
      const invaded = Game.rooms[room.memory.invadeRoom];
      if (invaded !== undefined) {
        RoomData.invaderCount = _.filter(invaded.find<Creep>(FIND_MY_CREEPS), (c: Creep) => {
          return c.memory.role === "invader";
        }).length;
      }
    }

    // Keep track colonies.
    if (room.memory.colonies !== undefined) {
      for (const i of room.memory.colonies) {
        const colony = Game.rooms[i];
        if (colony !== undefined) {
          RoomData.longHarvesterCount.push(_.filter(Game.creeps, (c: Creep) => {
            return c.memory.role === "longHarvester" && c.memory.home === room.name
                    && c.memory.targetRoom === colony.name;
          }).length);

          RoomData.reserverCount.push(_.filter(Game.creeps, (c: Creep) => {
            return c.memory.role === "reserver" && c.memory.home === room.name
              && c.memory.targetRoom === colony.name;
          }).length);
        }
      }
    }

    // Run spawn.
    for (const spawn of RoomData.spawns) {
      if (spawn.spawning) {
        if (Config.ENABLE_DEBUG_MODE) {
          log.info("Spawning " + Game.creeps[spawn.spawning.name].memory.role);
        }
      }
      else {
        CreepFactory.run();
      }
    }

    // Update time to controller upgrade.
    if (room.memory.lastLevel !== room.controller!.level) {
      room.memory.upgradeTime = 0;
    }
    else {
      room.memory.upgradeTime++;
    }
    room.memory.lastLevel = room.controller!.level;
    if (Game.time % 50 === 0) {
      const ticksRemaining = (room.memory.upgradeTime / room.controller!.progress) *
        room.controller!.progressTotal - room.controller!.progress;
      const secondsRemaining = ticksRemaining / 3.2;

      let hours: number | string = Math.floor(secondsRemaining / 3600);
      let minutes: number | string = Math.floor((secondsRemaining - (hours * 3600)) / 60);
      let seconds: number | string = Math.floor(secondsRemaining - (hours * 3600) - (minutes * 60));
      let days: number | string = Math.floor(hours / 24);
      hours = hours - days * 24;

      if (days === 0) {
        days = "";
      }
      else {
        days = days + " days ";
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      log.info(`${room.name}: ${days}${hours}:${minutes}:${seconds} left to RCL ${room.controller!.level + 1}.`);
    }
  }

  // Run creep roles.
  for (const creep of RoomData.creeps) {
    if (!creep.room.controller!.my) {
      creep.notifyWhenAttacked(false);
    }
    else {
      creep.notifyWhenAttacked(true);
    }

    creep.runRole();
  }

  // Clears any non-existing creep memory.
  for (const name in Memory.creeps) {
    const creep: any = Memory.creeps[name];

    if (creep.room === room.name) {
      if (!Game.creeps[name]) {
        if (Config.ENABLE_DEBUG_MODE) {
          log.info("Clearing non-existing creep memory:", name);
        }
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

  // Get minerals.
  RoomData.minerals = room.find<Mineral>(FIND_MINERALS);

  // Get structures.
  RoomData.structures = room.find<Structure>(FIND_STRUCTURES);

  for (const s of RoomData.structures) {
    switch (s.structureType) {
      case STRUCTURE_ROAD:
        RoomData.roads.push(s as StructureRoad);
        break;
      case STRUCTURE_WALL:
        RoomData.walls.push(s as StructureWall);
        break;
      case STRUCTURE_EXTENSION:
        RoomData.extensions.push(s as Extension);
        break;
      case STRUCTURE_RAMPART:
        RoomData.ramparts.push(s as Rampart);
        break;
      case STRUCTURE_CONTAINER:
        if (RoomData.minerals[0] && s.pos.isNearTo(RoomData.minerals[0].pos)) {
          RoomData.mineralContainer = s as Container;
        }
        else {
          RoomData.containers.push(s as Container);
        }
        break;
      case STRUCTURE_LINK:
        if (s.pos.inRangeTo(RoomData.storage!.pos, 3)) {
          RoomData.storageToLink = s as Link;
        }
        else if (s.pos.inRangeTo(RoomData.room.controller!.pos, 3)) {
          RoomData.upgradeToLink = s as Link;
        }
        else {
          if (RoomData.sources.length > 1) {
            for (const source of RoomData.sources) {
              if (s.pos.inRangeTo(source, 3)) {
                if (RoomData.storageFromLink === undefined) {
                  RoomData.storageFromLink = s as Link;
                }
                else {
                  RoomData.upgradeFromLink = s as Link;
                }
              }
            }
          }
          else {
            RoomData.storageFromLink = s as Link;
            RoomData.upgradeFromLink = s as Link;
          }
        }
        break;
      case STRUCTURE_TOWER:
        RoomData.towers.push(s as Tower);
        break;
      case STRUCTURE_SPAWN:
        RoomData.spawns.push(s as Spawn);
        break;
      case STRUCTURE_STORAGE:
        RoomData.storage = s as Storage;
        break;
      case STRUCTURE_EXTRACTOR:
        RoomData.extractor = s as StructureExtractor;
        break;
    }
  }

  // Get construction sites.
  RoomData.sites = room.find<ConstructionSite>(FIND_MY_CONSTRUCTION_SITES);

  // Get creeps.
  RoomData.creeps = room.find<Creep>(FIND_MY_CREEPS);

  // Get hostile creeps.
  RoomData.hostileCreeps = _.filter(room.find<Creep>(FIND_HOSTILE_CREEPS), (c: Creep) => {
    return (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0) ||
      c.pos.inRangeTo(RoomData.spawns[0].pos, 5) || c.pos.inRangeTo(RoomData.room.controller!.pos, 5);
  });

  // Get dropped resources.
  RoomData.dropped = room.find<Resource>(FIND_DROPPED_RESOURCES);

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
  "accountant",
  "builder",
  "courier",
  "harvester",
  "healer",
  "invader",
  "longHarvester",
  "miner",
  "rampartRepairer",
  "repairer",
  "reserver",
  "sentinel",
  "transporter",
  "upgrader",
  "wallRepairer"
];
