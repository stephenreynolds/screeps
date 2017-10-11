import * as priorities from "json/priorities.json";

export function run(room: Room, structures: Structure[], sites: ConstructionSite[]) {
  room.memory.repairTarget = repairTarget(structures);
  room.memory.buildTarget = buildTarget(sites);
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
