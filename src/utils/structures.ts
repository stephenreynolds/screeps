export function hasResource(structure: any, resource: string) {
  return structure.energy > 0 || structure.store[resource] > 0;
}

export function notFull(structure: any, resource: string) {
  if (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) {
    return structure.store[resource] < structure.storeCapacity;
  }
  else {
    return structure.energy < structure.energyCapacity;
  }
}

export function notFullHealth(object: any) {
  return object.hits < object.hitsMax;
}
