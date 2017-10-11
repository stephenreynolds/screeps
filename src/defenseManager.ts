import { log } from "lib/logger/log";
import { RoomData } from "roomData";

export function run() {
  RoomData.room.memory.DEFCONTime++;

  if (RoomData.hostileCreeps.length === 0) {
    updateDEFCON(0);
    DEFCON0();
  }
  else if (RoomData.hostileCreeps.length > 0 && RoomData.hostileCreeps.length <= 4) {
    if ((RoomData.room.memory.DEFCON === 1 && RoomData.room.memory.DEFCONTime > 50)
        || RoomData.room.memory.DEFCON === 2) {
      const time = RoomData.room.memory.DEFCONTime;
      updateDEFCON(2);
      RoomData.room.memory.DEFCONTime = time;
      DEFCON2(RoomData.hostileCreeps);
    }
    else {
      updateDEFCON(1);
      DEFCON1(RoomData.hostileCreeps);
    }
  }
  else if (RoomData.hostileCreeps.length > 4 && RoomData.hostileCreeps.length < 10) {
    updateDEFCON(3);
    DEFCON3(RoomData.hostileCreeps);
  }
  else if (RoomData.hostileCreeps.length >= 10) {
    updateDEFCON(4);
    DEFCON4(RoomData.hostileCreeps);
  }
}

function updateDEFCON(level: number) {
  if (level !== RoomData.room.memory.DEFCON) {
    RoomData.room.memory.DEFCONTime = 0;

    if (level > RoomData.room.memory.DEFCON) {
      log.warning("DEFCON level escalated to " + level + " in " + RoomData.room.name);
    }
    else {
      log.warning("DEFCON level degraded to " + level + " in " + RoomData.room.name);
    }
  }

  RoomData.room.memory.DEFCON = level;
}

function orderSentinels(sentinels: number, healers: number) {
  RoomData.room.memory.sentinels = sentinels;
  RoomData.room.memory.healers = healers;
}

function DEFCON0() {
  orderSentinels(0, 0);

  if (RoomData.towers[0] !== undefined) {
    const structure = _.filter(RoomData.structures, (s: Structure) => {
      return (s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART) ||
        (s.hits < 20000 && (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART));
    })[0];

    for (const tower of RoomData.towers) {
      tower.repair(structure);
    }
  }
}

function DEFCON1(hostiles: Creep[]) {
  DEFCON0();

  for (const tower of RoomData.towers) {
    tower.attack(hostiles[0]);
  }
}

function DEFCON2(hostiles: Creep[]) {
  DEFCON1(hostiles);

  orderSentinels(2, 0);
}

function DEFCON3(hostiles: Creep[]) {
  DEFCON2(hostiles);

  orderSentinels(hostiles.length, 1);
}

function DEFCON4(hostiles: Creep[]) {
  DEFCON3(hostiles);

  orderSentinels(hostiles.length * 2, hostiles.length / 4);
}
