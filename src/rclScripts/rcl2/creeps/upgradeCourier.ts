import { getResourceFromSource, transfer, withdraw, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";

export function run(creep: Creep) {
  workingToggle(creep);

  if (creep.memory.working) {
    transferEnergy(creep);
  }
  else {
    getEnergy(creep);
  }
}

function transferEnergy(creep: Creep) {
  if (creep.memory.upgradeContainerId !== undefined) {
    const container = Game.getObjectById<Container>(creep.memory.upgradeContainerId);

    if (container !== null) {
      transfer(creep, container, RESOURCE_ENERGY);
    }
    else {
      creep.memory.upgradeContainer = undefined;
    }
  }
  else {
    reassignUpgradeContainer(creep);
  }
}

function getEnergy(creep: Creep) {
  if (creep.memory.containerId !== undefined) {
    const container = Game.getObjectById<Container>(creep.memory.containerId);
    if (container !== null) {
      withdraw(creep, container, RESOURCE_ENERGY);
    }
    else {
      getResourceFromSource(creep, RoomData.sources);
    }
  }
  else {
    const container = _.sample(RoomData.containers);
    creep.memory.containerId = container.id;
  }
}

function reassignUpgradeContainer(creep: Creep) {
  if (RoomData.upgradeContainer !== undefined) {
    creep.memory.upgradeContainerId = RoomData.upgradeContainer.id;
  }
  else {
    return false;
  }
}
