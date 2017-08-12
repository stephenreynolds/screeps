import { createBalancedCreep, createCreep, createMiner, printSpawnInfo } from "utils/spawning";
import { RoomData } from "./roomData";

export function run() {
  const creepsOfRole = RoomData.creepsOfRole as any;
  printSpawnInfo(RoomData.spawn);

  if (creepsOfRole["courier"] < RoomData.containers) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "courier", [WORK, CARRY, MOVE]);
  }
  else if (creepsOfRole["sentinel"] < RoomData.room.memory.sentinels) {
    createCreep(RoomData.spawn, "sentinel", [ATTACK, ATTACK, MOVE, MOVE]);
  }
  else if (creepsOfRole["healer"] < RoomData.room.memory.healer) {
    createCreep(RoomData.spawn, "healer", [HEAL, MOVE]);
  }
  else if (creepsOfRole["upgraderCourier"] < 1 && RoomData.upgradeContainer !== undefined) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "upgradeCourier", [WORK, CARRY, MOVE]);
  }
  else if (creepsOfRole["miner"] < RoomData.containers) {
    createMiner(RoomData.spawn, RoomData.sources, RoomData.creeps, RoomData.containers);
  }
  else if (creepsOfRole["upgrader"] < 3) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "upgrader", [WORK, CARRY, MOVE]);
  }
  else if (creepsOfRole["builder"] < 3 && RoomData.sites.length > 0) {
    if (Game.getObjectById(RoomData.room.memory.construct) !== undefined) {
      createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "builder",
        [WORK, CARRY, MOVE], { targetId: RoomData.room.memory.construct });
    }
    else {
      RoomData.room.memory.construct = undefined;
      createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "builder", [WORK, CARRY, MOVE]);
    }
  }
  else if (creepsOfRole["repairer"] < 1) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "repairer", [WORK, CARRY, MOVE]);
  }
  else if (creepsOfRole["rampartRepairer"] < 1) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "rampartRepairer", [WORK, CARRY, MOVE]);
  }
  else if (creepsOfRole["wallRepairer"] < 1) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "wallRepairer", [WORK, CARRY, MOVE]);
  }
  else if (RoomData.room.memory.colony !== undefined && RoomData.longHarvesterCount < 2) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable,
      "longHarvester", [WORK, CARRY, CARRY, MOVE, MOVE]);
  }
  else if (creepsOfRole["scavenger"] < 1) {
    createCreep(RoomData.spawn, "scavenger", [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]);
  }
  else if (RoomData.room.memory.invadeRoom !== undefined && RoomData.invaderCount < 10) {
    createBalancedCreep(RoomData.spawn, RoomData.room.energyAvailable, "invader",
      [ATTACK, MOVE, TOUGH, TOUGH], { targetRoom: RoomData.room.memory.invadeRoom });
  }
}
