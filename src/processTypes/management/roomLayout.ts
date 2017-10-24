import { log } from "lib/logger/log";
import { Process } from "../../OS/Process";

export class RoomLayoutProcess extends Process
{
  public type = "roomLayout";

  private buildPriorities = [
    "spawn",
    "container",
    "storage",
    "link",
    "extractor",
    "terminal",
    "extension",
    "tower",
    "lab",
    "powerSpawn",
    "nuker",
    "constructedWall",
    "rampart",
    "road"
  ];

  public run()
  {
    const room = Game.rooms[this.metaData.roomName];
    const roomPlan = require(`json/rooms/${room.name}.json`).rcl[room.controller!.level]["buildings"];
    let siteCount = room.memory.numSites;

    if (siteCount < 10)
    {
      // For each building...
      for (const key of this.buildPriorities)
      {
        if (!roomPlan.hasOwnProperty(key))
        {
          continue;
        }

        // Get each position...
        for (const position in roomPlan[key]["pos"])
        {
          const pos = new RoomPosition(roomPlan[key]["pos"][position].x,
            roomPlan[key]["pos"][position].y, room.name);

          // Check if structure or construction site already exists here.
          const structures = _.filter(pos.look(), (r) =>
          {
            if (r.type === "structure")
            {
              return r.structure!.structureType === key;
            }
            else if (r.type === "constructionSite")
            {
              return r.constructionSite!.structureType === key;
            }
            else
            {
              return false;
            }
          });

          // Create construction site if nothing is here.
          if (structures.length === 0)
          {
            if (pos.createConstructionSite(key) === OK)
            {
              log.info(`Site created for ${key} at ${pos}`);
              siteCount++;
            }

            if (siteCount >= 10)
            {
              return;
            }
          }
        }
      }
    }

    this.completed = true;
  }
}
