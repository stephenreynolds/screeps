import { RoomData } from "./roomData";

export function run() {
  let siteCount = RoomData.sites.length;
  if (siteCount < 10) {
    const roomPlan = require(`json/rooms/${RoomData.room.name}.json`).rcl[RoomData.room.controller!.level]["buildings"];

    // For each building...
    for (const key in roomPlan) {
      // Get each position...
      for (const position in roomPlan[key]["pos"]) {
        const pos = new RoomPosition(roomPlan[key]["pos"][position].x,
          roomPlan[key]["pos"][position].y, RoomData.room.name);

        // Check if structure or construction site already exists here.
        const structures = _.filter(pos.look(), (r) => {
          if (r.type === "structure") {
            return r.structure && r.structure.structureType === key;
          }
          else if (r.type === "constructionSite") {
            return r.constructionSite && r.constructionSite.structureType === key;
          }
          else {
            return false;
          }
        });

        // Create construction site if nothing is here.
        if (structures.length === 0 && siteCount <= 10) {
          pos.createConstructionSite(key);
          siteCount++;
        }
      }
    }
  }
}
