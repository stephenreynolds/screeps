export function harvest(creep: Creep, source: Source | Mineral) {
  const action = creep.harvest(source);

  if (action === ERR_NOT_IN_RANGE) {
    creep.moveToTarget(source.pos);
  }

  return action;
}

export function withdraw(creep: Creep, target: Structure, resource: string, amount?: number) {
  const action = creep.withdraw(target, resource, amount);

  if (action === ERR_NOT_IN_RANGE) {
    creep.moveToTarget(target.pos);
  }

  return action;
}

export function transfer(creep: Creep, target: Structure, resource: string, amount?: number) {
  const action = creep.transfer(target, resource, amount);

  if (action === ERR_NOT_IN_RANGE) {
    creep.moveToTarget(target.pos);
  }

  return action;
}

export function repair(creep: Creep, target: Structure) {
  const action = creep.repair(target);

  if (action === ERR_NOT_IN_RANGE) {
    creep.moveToTarget(target.pos);
  }

  return action;
}
