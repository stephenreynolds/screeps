import * as creepActions from "../creepActions";
import * as roleUpgrader from "./upgrader";

export function run(creep: Creep): void {
  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, creep.room.find<Spawn>(FIND_MY_SPAWNS)[0]);
  }
  else if (_.sum(creep.carry) === creep.carryCapacity) {
    construct(creep);
  }
  else {
    creepActions.harvest(creep);
  }
}

function construct(creep: Creep) {
  const site = creep.pos.findClosestByPath<ConstructionSite>(FIND_CONSTRUCTION_SITES);

  if (site !== undefined) {
    if (creep.build(site) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, site.pos);
    }
  }
  else {
    roleUpgrader.run(creep);
  }
}
