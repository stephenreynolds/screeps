import { getResourceFromSource, transfer, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleUpgrader from "./upgrader";

export function run(creep: Creep) {
  workingToggle(creep);

  if (creep.memory.working) {
    if (RoomData.spawn.energy < RoomData.spawn.energyCapacity) {
      transfer(creep, RoomData.spawn, RESOURCE_ENERGY);
    }
    else {
      RoleUpgrader.run(creep);
    }
  }
  else {
    getResourceFromSource(creep, RoomData.sources);
  }
}
