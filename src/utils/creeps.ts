export function workingToggle(creep: Creep) {
  if (creep.memory.working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
  }
  else if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
  }
}

export function moveTo(creep: Creep, target: RoomPosition) {
  creep.memory.moveTarget = target;
  creep.moveTo(creep.memory.moveTarget, {
    reusePath: 7, visualizePathStyle: {
      fill: "transparent",
      lineStyle: "dashed",
      opacity: .1,
      stroke: "#fff",
      strokeWidth: .15
    }
  });
}

export function moveToRoom(creep: Creep, roomName: string) {
  moveTo(creep, Game.flags[roomName + "-NAV"].pos);
}

export function harvest(creep: Creep, source: Source | Mineral) {
  const action = creep.harvest(source);

  if (action === ERR_NOT_IN_RANGE) {
    moveTo(creep, source.pos);
  }

  return action;
}

export function withdraw(creep: Creep, target: Structure, resource: string, amount?: number) {
  const action = creep.withdraw(target, resource, amount);

  if (action === ERR_NOT_IN_RANGE) {
    moveTo(creep, target.pos);
  }

  return action;
}

export function transfer(creep: Creep, target: Structure, resource: string, amount?: number) {
  const action = creep.transfer(target, resource, amount);

  if (action === ERR_NOT_IN_RANGE) {
    moveTo(creep, target.pos);
  }

  return action;
}

export function getResourceFromSource(creep: Creep, sources: Source[] | Mineral[]) {
  if (creep.memory.targetSourceId !== undefined) {
    const source = Game.getObjectById<Source>(creep.memory.targetSourceId);

    if (source !== null) {
      return harvest(creep, source);
    }
    else {
      creep.memory.targetSourceId = undefined;
    }
  }
  else {
    const source = _.sample(sources) as Source;

    if (source !== undefined) {
      creep.memory.targetSourceId = source.id;
    }
  }
}
