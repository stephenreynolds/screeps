import { log } from "boilerplate/lib/logger/log";
import { RoomData } from "roomData";

export function run() {
  const hostileCreeps = _.filter(RoomData.hostileCreeps, (c: Creep) => {
    return c.getActiveBodyparts(ATTACK) || c.getActiveBodyparts(RANGED_ATTACK);
  });
  RoomData.room.memory.DEFCONTime++;

  if (hostileCreeps.length === 0) {
    updateDEFCON(0);
    DEFCON0();
  }
  else if (hostileCreeps.length > 0 && hostileCreeps.length <= 4) {
    if (RoomData.room.memory.DEFCON === 1 && RoomData.room.memory.DEFCONTime > 50) {
      const time = RoomData.room.memory.DEFCONTime;
      updateDEFCON(2);
      RoomData.room.memory.DEFCONTime = time;
      DEFCON2(hostileCreeps);
    }
    else {
      updateDEFCON(1);
      DEFCON1(hostileCreeps);
    }
  }
  else if (hostileCreeps.length > 4 && hostileCreeps.length < 10) {
    updateDEFCON(3);
    DEFCON3(hostileCreeps);
  }
  else if (hostileCreeps.length >= 10) {
    updateDEFCON(4);
    DEFCON4(hostileCreeps);
  }
}

function updateDEFCON(level: number) {
  if (level !== RoomData.room.memory.DEFCON) {
    RoomData.room.memory.DEFCONTime = 0;

    if (level > RoomData.room.memory.DEFCON) {
      log.warning("DEFCON level escalated to " + level);
    }
    else {
      log.warning("DEFCON level degraded to " + level);
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
