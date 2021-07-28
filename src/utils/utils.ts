import { Scheduler } from "scheduler";
import { CreepBuilder } from "./creepBuilder";
import { Process } from "processes/process";
import { RoomPathFinder } from "./roomPathFinder";
import { EscortCreepProcess } from "processes/creeps/escort";
import _ from "lodash";

export const Utils = {
  getLiveCreeps(list: string[]): string[] {
    return _.filter(list, (name: string) => {
      return Game.creeps[name];
    });
  },

  inflateCreeps(list: string[]): Creep[] {
    return _.transform(list, (result: any, name: any) => {
      result.push(Game.creeps[name]);
    });
  },

  /** Returns the room closest to the source room with the required spawn energy */
  nearestRoom(sourceRoom: string, minSpawnEnergy = 0) {
    let bestRoom = "";
    let bestDistance = 999;

    _.forEach(Game.rooms, (room: Room) => {
      if (room.controller && room.controller.my) {
        if (room.energyCapacityAvailable >= minSpawnEnergy) {
          const path = new RoomPathFinder(sourceRoom, room.name).results();

          if (path.length < bestDistance) {
            bestDistance = path.length;
            bestRoom = room.name;
          }
        }
      }
    });

    return bestRoom;
  },

  /** Calculate the maximum rampart health for the given room */
  rampartHealth(scheduler: Scheduler, roomName: string) {
    const room = Game.rooms[roomName];

    if (room.controller!.level < 3) {
      return 0;
    }
    else {
      const max = room.controller!.level * 100000;

      const average = Math.ceil(_.sum(scheduler.data.roomData[roomName].ramparts as never[], "hits") /
        scheduler.data.roomData[roomName].ramparts.length);
      const target = average + 10000;

      return target > max ? max : target;
    }
  },

  spawn(scheduler: Scheduler, roomName: string, creepType: string, name: string, memory = {}): boolean {
    const body = CreepBuilder.design(creepType, Game.rooms[roomName]);
    const spawns = scheduler.data.roomData[roomName].spawns;
    let spawned = false;

    _.forEach(spawns, (spawn: StructureSpawn) => {
      if (!_.includes(scheduler.data.usedSpawns, spawn.id) && !spawn.spawning && spawn.spawnCreep(body, name, { dryRun: true }) === OK) {
        console.log(`Spawning creep ${name} in ${roomName}.`);
        spawn.spawnCreep(body, name, memory);
        spawned = true;
        scheduler.data.usedSpawns.push(spawn.id);
      }
    });

    return spawned;
  },

  spawnEscort(process: Process, creep: Creep) {
    if (!process.metaData.escortCreep) {
      process.metaData.escortCreep = undefined;
    }

    if (!Game.creeps[process.metaData.escortCreep]) {
      const creepName = `escort-${creep.name}`;
      const spawned = Utils.spawn(
        process.scheduler,
        process.metaData.deliverRoom,
        "brawler",
        creepName
      );

      if (spawned) {
        process.metaData.escortCreep = creepName;
        process.scheduler.addProcess(EscortCreepProcess, `ecreep-${creep.name}`, process.priority + 1, {
          creep: creepName,
          defendCreep: creep.name
        });
      }
    }
  },

  withdrawTarget(creep: Creep, proc: Process) {
    let withdraws = [].concat(
      proc.scheduler.data.roomData[creep.room.name].containers as never[]
    );

    if (creep.room.storage) {
      withdraws = [].concat(
        withdraws,
        [creep.room.storage] as never[]
      );
    }

    if (withdraws.length === 0 && proc.scheduler.getProcessesByType("hlf").length > 1) {
      withdraws = proc.scheduler.data.roomData[creep.room.name].spawns as never[];
      withdraws = _.filter(withdraws, (spawn: StructureSpawn) => {
        return (spawn.energy > 250 && spawn.room.energyAvailable > (spawn.room.energyCapacityAvailable - 50));
      }) as never[];
    }

    withdraws = _.filter(withdraws, (w: StructureStorage | StructureContainer) => {
      return w.store.getUsedCapacity() > 0;
    }) as never[];

    return creep.pos.findClosestByRange(withdraws)! as Structure;
  },

  workRate(creeps: Creep[], perWorkPart: number): number {
    let workRate = 0;

    _.forEach(creeps, (creep: Creep) => {
      _.forEach(creep.body, (part: BodyPartDefinition) => {
        if (part.type === WORK) {
          workRate += perWorkPart;
        }
      });
    });

    return workRate;
  }
};
