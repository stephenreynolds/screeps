
import { RoomData } from "roomData";
import { hasResource } from "utils";
import { moveTo } from "./creepUtils";

/**
 * Get energy from a random source.
 *
 * @export
 * @param {Creep} creep
 */
export function getResourceFromSource(creep: Creep, resource: string) {
  let targetSource;

  if (creep.memory.targetSource === undefined) {
    if (resource === RESOURCE_ENERGY) {
      targetSource = _.sample(RoomData.sources);
    }
    else {
      targetSource = _.sample(RoomData.minerals);
    }

    creep.memory.targetSource = targetSource.id;
  }
  else {
    targetSource = Game.getObjectById(creep.memory.targetSource) as Source | Mineral;
    const action = creep.harvest(targetSource);
    switch (action) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, targetSource.pos);
        break;
      case OK:
        if (_.sum(creep.carry) === creep.carryCapacity) {
          creep.memory.targetSource = undefined;
          creep.memory.targetType = undefined;
        }
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        creep.memory.targetSource = undefined;
        creep.memory.targetType = undefined;
        break;
    }
  }
}

/**
 * Get energy from storage.
 *
 * @export
 * @param {Creep} creep
 * @returns ERR_NOT_FOUND if storage does not exist.
 */
export function getResourceFromStorage(creep: Creep, resource: string) {
  let targetSource;

  if (creep.memory.targetSource === undefined) {
    if (RoomData.storage !== undefined) {
      targetSource = RoomData.storage;
      creep.memory.targetSource = targetSource.id;
    }
    else {
      return ERR_NOT_FOUND;
    }
  }
  else {
    targetSource = Game.getObjectById(creep.memory.targetSource) as Storage;
    const action = creep.withdraw(targetSource, resource);
    switch (action) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, targetSource.pos);
        break;
      case OK:
        if (_.sum(creep.carry) === creep.carryCapacity) {
          creep.memory.targetSource = undefined;
          creep.memory.targetType = undefined;
        }
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        creep.memory.targetSource = undefined;
        creep.memory.targetType = undefined;
        break;
    }
  }
}

/**
 * Get energy from a random container.
 *
 * @export
 * @param {Creep} creep
 * @returns ERR_NOT_FOUND if no container exists.
 */
export function getResourceFromContainer(creep: Creep, resource: string) {
  if (creep.memory.targetSource === undefined) {
    if (RoomData.containers[0] !== undefined) {
      const containers = _.filter(RoomData.containers, (c: Container) => {
        return hasResource(c, RESOURCE_ENERGY);
      });

      creep.memory.targetSource = _.sample(containers).id;
    }
    else {
      return ERR_NOT_FOUND;
    }
  }
  else {
    const targetSource = Game.getObjectById(creep.memory.targetSource) as Container;
    const action = creep.withdraw(targetSource, resource);
    switch (action) {
      case ERR_NOT_IN_RANGE:
        moveTo(creep, targetSource.pos);
        break;
      case OK:
        if (_.sum(creep.carry) === creep.carryCapacity) {
          creep.memory.targetSource = undefined;
          creep.memory.targetType = undefined;
        }
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        creep.memory.targetSource = undefined;
        creep.memory.targetType = undefined;
        break;
    }
  }
}

/**
 * Get energy from storage, container, or source, in that order.
 *
 * @export
 * @param {Creep} creep
 */
export function getEnergy(creep: Creep) {
  let targetSource;

  if (creep.memory.targetSource === undefined) {
    // Check storage first.
    if (RoomData.storage !== undefined && hasResource(RoomData.storage, RESOURCE_ENERGY)) {
      targetSource = RoomData.storage;
      creep.memory.targetType = STRUCTURE_STORAGE;
    }
    else {
      // Check mining containers second.
      const miningContainers = _.filter(RoomData.containers, (c: Container) => {
        return hasResource(c, RESOURCE_ENERGY);
      });

      if (miningContainers[0] !== undefined) {
        targetSource = _.sample(miningContainers);
        creep.memory.targetType = STRUCTURE_CONTAINER;
      }
      else {
        // Get from energy source last.
        targetSource = creep.pos.findClosestByPath(RoomData.sources);
        creep.memory.targetType = RESOURCE_ENERGY;
      }
    }

    creep.memory.targetSource = targetSource.id;
  }
  else {
    targetSource = Game.getObjectById(creep.memory.targetSource);

    if (creep.memory.targetType === RESOURCE_ENERGY) {
      targetSource = targetSource as Source;

      const action = creep.harvest(targetSource);
      switch (action) {
        case ERR_NOT_IN_RANGE:
          moveTo(creep, targetSource.pos);
          break;
        case OK:
          if (_.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.targetSource = undefined;
            creep.memory.targetType = undefined;
          }
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.memory.targetSource = undefined;
          creep.memory.targetType = undefined;
          break;
      }
    }
    else {
      targetSource = targetSource as Storage | Container;

      const action = creep.withdraw(targetSource, RESOURCE_ENERGY);
      switch (action) {
        case ERR_NOT_IN_RANGE:
          moveTo(creep, targetSource.pos);
          break;
        case OK:
          if (_.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.targetSource = undefined;
            creep.memory.targetType = undefined;
          }
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          creep.memory.targetSource = undefined;
          creep.memory.targetType = undefined;
          break;
      }
    }
  }
}
