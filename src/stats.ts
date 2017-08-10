import { RoomData } from "roomData";
import { AVERAGE_TICK_TIME } from "./utils";

export const globalProfile = {
  builder: 0,
  claimer: 0,
  compile: 0,
  constructionSites: 0,
  courier: 0,
  defense: 0,
  harvester: 0,
  healer: 0,
  invader: 0,
  invaders: 0,
  miner: 0,
  prepare: 0,
  rampartRepairer: 0,
  repairer: 0,
  reserver: 0,
  scavenger: 0,
  sentinel: 0,
  spawning: 0,
  transporter: 0,
  upgrader: 0,
  wallRepairer: 0
};

export function init() {
  if (Memory.stats === undefined) {
    Memory.stats = {};
  }

  globalProfile.builder = 0;
  globalProfile.claimer = 0;
  globalProfile.compile = 0;
  globalProfile.courier = 0;
  globalProfile.constructionSites = 0;
  globalProfile.defense = 0;
  globalProfile.harvester = 0;
  globalProfile.healer = 0;
  globalProfile.invader = 0;
  globalProfile.miner = 0;
  globalProfile.rampartRepairer = 0;
  globalProfile.repairer = 0;
  globalProfile.reserver = 0;
  globalProfile.scavenger = 0;
  globalProfile.sentinel = 0;
  globalProfile.spawning = 0;
  globalProfile.transporter = 0;
  globalProfile.upgrader = 0;
  globalProfile.wallRepairer = 0;
}

export function global() {
  Memory.stats["gcl.progress"] = Game.gcl.progress;
  Memory.stats["gcl.progressTotal"] = Game.gcl.progressTotal;
  Memory.stats["gcl.level"] = Game.gcl.level;
  Memory.stats["cpu.used"] = Game.cpu.getUsed();
  Memory.stats["cpu.limit"] = Game.cpu.limit;
  Memory.stats["memory.size"] = RawMemory.get().length;

  Memory.stats["global.compile"] = globalProfile.compile;
  Memory.stats["global.defense"] = globalProfile.defense;
  Memory.stats["global.spawning"] = globalProfile.spawning;
  Memory.stats["global.constructionSites"] = globalProfile.constructionSites;

  Memory.stats["global.roles.builder"] = globalProfile.builder;
  Memory.stats["global.roles.claimer"] = globalProfile.claimer;
  Memory.stats["global.roles.courier"] = globalProfile.courier;
  Memory.stats["global.roles.harvester"] = globalProfile.harvester;
  Memory.stats["global.roles.healer"] = globalProfile.healer;
  Memory.stats["global.roles.invader"] = globalProfile.invader;
  Memory.stats["global.roles.miner"] = globalProfile.miner;
  Memory.stats["global.roles.rampartRepairer"] = globalProfile.rampartRepairer;
  Memory.stats["global.roles.repairer"] = globalProfile.repairer;
  Memory.stats["global.roles.reserver"] = globalProfile.reserver;
  Memory.stats["global.roles.scavenger"] = globalProfile.scavenger;
  Memory.stats["global.roles.sentinel"] = globalProfile.sentinel;
  Memory.stats["global.roles.transporter"] = globalProfile.transporter;
  Memory.stats["global.roles.upgrader"] = globalProfile.upgrader;
  Memory.stats["global.roles.wallRepairer"] = globalProfile.wallRepairer;
}

export function room(profiler: any) {
  const prefix = "room." + RoomData.room.name;

  // Set up GCL ETA information.
  if (RoomData.room.memory.currentLevel !== undefined) {
    if (Game.gcl.level !== RoomData.room.memory.currentLevel) {
      RoomData.room.memory.gclStartTime = Game.time;
      RoomData.room.memory.currentLevel = Game.gcl.level;
    }

    Memory.stats["gcl.eta"] = (((RoomData.room.memory.gclStartTime - Game.time) / Game.gcl.progress)
      * (Game.gcl.progressTotal - Game.gcl.progress)) * AVERAGE_TICK_TIME;
  }

  // Room Manager profile.
  Memory.stats[prefix + ".compile"] = profiler.compile;
  Memory.stats[prefix + ".defense"] = profiler.defense;
  Memory.stats[prefix + ".spawning"] = profiler.spawning;

  // Room information.
  Memory.stats[prefix + ".rcl"] = RoomData.room.controller!.level;
  Memory.stats[prefix + ".rclProgress"] = RoomData.room.controller!.progress;
  Memory.stats[prefix + ".rclProgressTotal"] = RoomData.room.controller!.progressTotal;
  Memory.stats[prefix + ".defenseStatus"] = RoomData.room.memory.DEFCON;
  Memory.stats[prefix + ".constructionSites"] = RoomData.sites.length;
  Memory.stats[prefix + ".currentSite"] = RoomData.sites[0];
  Memory.stats[prefix + ".energyAvailable"] = RoomData.room.energyAvailable;
  Memory.stats[prefix + ".energyCapacity"] = RoomData.room.energyCapacityAvailable;

  // Creeps
  Memory.stats[prefix + ".roles.builder"] = profiler.builder;
  Memory.stats[prefix + ".roles.claimer"] = profiler.claimer;
  Memory.stats[prefix + ".roles.courier"] = profiler.courier;
  Memory.stats[prefix + ".roles.harvester"] = profiler.harvester;
  Memory.stats[prefix + ".roles.healer"] = profiler.healer;
  Memory.stats[prefix + ".roles.invader"] = profiler.invader;
  Memory.stats[prefix + ".roles.miner"] = profiler.miner;
  Memory.stats[prefix + ".roles.rampartRepairer"] = profiler.rampartRepairer;
  Memory.stats[prefix + ".roles.repairer"] = profiler.repairer;
  Memory.stats[prefix + ".roles.reserver"] = profiler.reserver;
  Memory.stats[prefix + ".roles.scavenger"] = profiler.scavenger;
  Memory.stats[prefix + ".roles.sentinel"] = profiler.sentinel;
  Memory.stats[prefix + ".roles.transporter"] = profiler.transporter;
  Memory.stats[prefix + ".roles.upgrader"] = profiler.upgrader;
  Memory.stats[prefix + ".roles.wallRepairer"] = profiler.wallRepairer;

  // Update global profile.
  globalProfile.builder += profiler.builder;
  globalProfile.claimer += profiler.claimer;
  globalProfile.compile += profiler.compile;
  globalProfile.constructionSites += RoomData.sites.length;
  globalProfile.courier += profiler.courier;
  globalProfile.defense += profiler.defense;
  globalProfile.harvester += profiler.harvester;
  globalProfile.healer += profiler.healer;
  globalProfile.invader += profiler.invader;
  globalProfile.miner += profiler.miner;
  globalProfile.rampartRepairer += profiler.rampartRepairer;
  globalProfile.repairer += profiler.repairer;
  globalProfile.reserver += profiler.reserver;
  globalProfile.scavenger += profiler.scavenger;
  globalProfile.sentinel += profiler.sentinel;
  globalProfile.spawning += profiler.spawning;
  globalProfile.transporter += profiler.transporter;
  globalProfile.upgrader += profiler.upgrader;
  globalProfile.wallRepairer += profiler.wallRepairer;
}
