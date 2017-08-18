import { moveTo, workingToggle } from "utils/creeps";
import { RoomData } from "../roomData";
import * as RoleCourier from "./courier";

export function run(creep: Creep): void {
  workingToggle(creep);

  if (creep.memory.working) {
    if (creep.carry.energy !== undefined) {
      RoleCourier.run(creep);
    }
    else {
      // Set up minerals.
    }
  }
  else if (!creep.memory.working) {
    scavenge(creep);
  }
}

function scavenge(creep: Creep) {
  const resource = _.find(RoomData.dropped, (r: Resource) => {
    for (const c of RoomData.containers) {
      if (r.pos.isNearTo(c)) {
        return false;
      }
    }
    return true;
  });

  if (resource !== undefined) {
    if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
      moveTo(creep, resource.pos);
    }
  }
  else {
    RoleCourier.run(creep);
  }
}
