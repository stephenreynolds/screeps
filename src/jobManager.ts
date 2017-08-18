import * as priorities from "json/priorities.json";

export function run(room: Room, structures: Structure[], sites: ConstructionSite[],
                    extensions: Extension[], towers: Tower[], spawns: Spawn[]) {
  room.memory.repairTarget = repairTarget(structures);
  room.memory.buildTarget = buildTarget(sites);
  room.memory.energyTarget = energyTarget(extensions, towers, spawns);
}

function repairTarget(structures: Structure[]): string | undefined {
  for (const t of (priorities as any).repairPriorities) {
    for (const s of structures) {
      if (s.structureType === t && s.hits < s.hitsMax) {
        return s.id;
      }
    }
  }
}

function buildTarget(sites: ConstructionSite[]): string | undefined {
  if (sites.length > 0) {
    for (const t of (priorities as any).buildPriorities) {
      for (const s of sites) {
        if (s.structureType === t) {
          return s.id;
        }
      }
    }
  }
}

function energyTarget(extensions: Extension[], towers: Tower[], spawns: Spawn[]): string | undefined {
  for (const s of spawns) {
    if (s !== undefined && s.energy < s.energyCapacity) {
      return s.id;
    }
  }

  for (const t of towers) {
    if (t.energy < t.energyCapacity) {
      return t.id;
    }
  }

  for (const e of extensions) {
    if (e.energy < e.energyCapacity) {
      return e.id;
    }
  }

  return undefined;
}
