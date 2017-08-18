import { moveTo } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  const source = Game.getObjectById<Source>(creep.memory.sourceId)!;
  const container = source.pos.findInRange<Structure>(RoomData.containers, 1)[0];

  if (container !== undefined) {
    if (creep.pos.isEqualTo(container)) {
      if (RoomData.storageFromLink !== undefined && creep.pos.isNearTo(RoomData.storageFromLink.pos)
        && RoomData.storageToLink !== undefined) {
        if ((RoomData.storageFromLink.energy === RoomData.storageFromLink.energyCapacity &&
          RoomData.storageToLink.energy < RoomData.storageToLink.energyCapacity) ||
          (RoomData.storageToLink.energy === 0 && RoomData.storageFromLink.energy > 0)) {
          RoomData.storageFromLink.transferEnergy(RoomData.storageToLink);
        }
        if (creep.carry.energy === creep.carryCapacity) {
          creep.transfer(RoomData.storageFromLink, RESOURCE_ENERGY);
        }
        else {
          creep.harvest(source!);
        }
      }
      else if (RoomData.upgradeFromLink !== undefined && creep.pos.isNearTo(RoomData.upgradeFromLink.pos)) {
        if (RoomData.upgradeToLink !== undefined) {
          if ((RoomData.upgradeFromLink.energy === RoomData.upgradeFromLink.energyCapacity &&
            RoomData.upgradeToLink.energy < RoomData.upgradeToLink.energyCapacity) ||
            (RoomData.upgradeToLink.energy === 0 && RoomData.upgradeFromLink.energy > 0)) {
            RoomData.upgradeFromLink.transferEnergy(RoomData.upgradeToLink);
          }
          if (creep.carry.energy === creep.carryCapacity) {
            creep.transfer(RoomData.upgradeFromLink, RESOURCE_ENERGY);
          }
          else {
            creep.harvest(source!);
          }
        }
        else if (RoomData.storageToLink !== undefined) {
          if ((RoomData.upgradeFromLink.energy === RoomData.upgradeFromLink.energyCapacity &&
            RoomData.storageToLink.energy < RoomData.storageToLink.energyCapacity) ||
            (RoomData.storageToLink.energy === 0 && RoomData.upgradeFromLink.energy > 0)) {
            RoomData.upgradeFromLink.transferEnergy(RoomData.storageToLink);
          }
          if (creep.carry.energy === creep.carryCapacity) {
            creep.transfer(RoomData.upgradeFromLink, RESOURCE_ENERGY);
          }
          else {
            creep.harvest(source!);
          }
        }
      }
      else {
        creep.harvest(source!);
      }
    }
    else {
      moveTo(creep, container.pos);
    }
  }
}
