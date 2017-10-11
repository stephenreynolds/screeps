import * as priorities from "json/priorities.json";
import { log } from "lib/logger/log";
import { RoomData } from "./roomData";

export function run() {
  if (RoomData.room.controller!.level < 2) {
    return;
  }

  const roomPlan = require(`json/rooms/${RoomData.room.name}.json`).rcl[RoomData.room.controller!.level]["buildings"];
  let siteCount = RoomData.room.find<ConstructionSite>(FIND_MY_CONSTRUCTION_SITES).length;

  if (siteCount < 10) {
    // For each building...
    for (const key of (priorities as any).buildPriorities) {
      if (!roomPlan.hasOwnProperty(key)) {
        continue;
      }

      // Get each position...
      for (const position in roomPlan[key]["pos"]) {
        const pos = new RoomPosition(roomPlan[key]["pos"][position].x,
          roomPlan[key]["pos"][position].y, RoomData.room.name);

        // Check if structure or construction site already exists here.
        const structures = _.filter(pos.look(), (r) => {
          if (r.type === "structure") {
            return r.structure!.structureType === key;
          }
          else if (r.type === "constructionSite") {
            return r.constructionSite!.structureType === key;
          }
          else {
            return false;
          }
        });

        // Create construction site if nothing is here.
        if (structures.length === 0) {
          if (pos.createConstructionSite(key) === OK) {
            log.info(`Site created for ${key} at ${pos}`);
            siteCount++;
          }

          if (siteCount >= 10) {
            return;
          }
        }
      }
    }
  }
}
