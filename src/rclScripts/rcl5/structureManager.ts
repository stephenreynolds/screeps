import { RoomData } from "./roomData";

export function run() {
  const roomPlan = require("rooms/rcl5/" + RoomData.room.name);

  if (RoomData.spawn !== undefined) {
    if (RoomData.extensions.length >= Object.keys(roomPlan.room["buildings"]["extension"]["pos"]).length) {
      if (RoomData.containers.length + 1 >= Object.keys(roomPlan.room["buildings"]["container"]["pos"]).length) {
        if (RoomData.storage !== undefined) {
          if (RoomData.tower !== undefined) {
            if (RoomData.walls.length >= Object.keys(roomPlan.room["buildings"]["constructedWall"]["pos"]).length) {
              if (RoomData.ramparts.length >= Object.keys(roomPlan.room["buildings"]["rampart"]["pos"]).length) {
                if (RoomData.roads.length >= Object.keys(roomPlan.room["buildings"]["road"]["pos"]).length) {
                  return;
                }
                else {
                  const roadPositions = roomPlan.room["buildings"]["road"]["pos"];
                  for (const pos of roadPositions) {
                    RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                  }
                }
              }
              else {
                const rampartPositions = roomPlan.room["buildings"]["rampart"]["pos"];
                for (const pos of rampartPositions) {
                  RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_RAMPART);
                }
              }
            }
            else {
              const wallPositions = roomPlan.room["buildings"]["constructedWall"]["pos"];
              for (const pos of wallPositions) {
                RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_WALL);
              }
            }
          }
          else {
            const towerPositions = roomPlan.room["buildings"]["tower"]["pos"];
            for (const pos of towerPositions) {
              RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_TOWER);
            }
          }
        }
        else {
          const storagePositions = roomPlan.room["buildings"]["storage"]["pos"];
          for (const pos of storagePositions) {
            RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_STORAGE);
          }
        }
      }
      else {
        const containerPositions = roomPlan.room["buildings"]["container"]["pos"];
        for (const pos of containerPositions) {
          RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
        }
      }
    }
    else {
      const extensionPositions = roomPlan.room["buildings"]["extension"]["pos"];
      for (const pos of extensionPositions) {
        RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
      }
    }
  }
  else {
    const pos = roomPlan.room["buildings"]["spawn"]["pos"][0];
    RoomData.room.createConstructionSite(pos.x, pos.y, STRUCTURE_SPAWN);
  }
}
