import { log } from "Lib/Logger/Log";

import { Process } from "OS/Process";

import { BuildPriorities } from "./RCLPlans/BuildPriorities";
import { RCL0 } from "./RCLPlans/RCL0";
import { RCL1 } from "./RCLPlans/RCL1";
import { RCL2 } from "./RCLPlans/RCL2";
import { RCL3 } from "./RCLPlans/RCL3";
import { RCL4 } from "./RCLPlans/RCL4";
import { RCL5 } from "./RCLPlans/RCL5";
import { RCL6 } from "./RCLPlans/RCL6";
import { RCL7 } from "./RCLPlans/RCL7";
import { RCL8 } from "./RCLPlans/RCL8";
import { RCLPlan } from "./RCLPlans/RCLPlan";

export class RoomLayoutManagementProcess extends Process
{
    public type = "roomLayout";

    public readonly maxSites = 10;  // Max number of sites per room.

    public run()
    {
        const room = Game.rooms[this.metaData.roomName];

        if (room.memory.roomPlan && room.memory.roomPlan.version === RCLPlan.version)
        {
            const siteCount = room.memory.numSites;

            if (siteCount < this.maxSites)
            {
                this.createSites(room);
            }
        }
        else
        {
            this.generateRoomPlan(room);
        }
    }

    private generateRoomPlan(room: Room)
    {
        if (!room.controller!.my || room.memory.cache.spawns.length === 0)
        {
            return;
        }

        room.memory.roomPlan = {};
        room.memory.roomPlan.version = RCLPlan.version;
        room.memory.roomPlan.rcl = [];

        new RCL0(room, this.kernel).generate();
        new RCL1(room, this.kernel).generate();
        new RCL2(room, this.kernel).generate();
        new RCL3(room, this.kernel).generate();
        new RCL4(room, this.kernel).generate();
        new RCL5(room, this.kernel).generate();
        new RCL6(room, this.kernel).generate();
        new RCL7(room, this.kernel).generate();
        new RCL8(room, this.kernel).generate();
    }

    private createSites(room: Room)
    {
        const roomPlan = room.memory.roomPlan.rcl[this.getBuildableRCL(room, room.controller!.level)];
        let siteCount = room.memory.numSites;

        // For each building...
        for (const key of BuildPriorities)
        {
            if (!roomPlan.hasOwnProperty(key))
            {
                continue;
            }

            // Get each position...
            for (const i in roomPlan[key])
            {
                const position = new RoomPosition(roomPlan[key][i].x,
                    roomPlan[key][i].y, room.name);

                // Check if structure or construction site already exists here.
                const structures = _.filter(position.look(), (r: LookAtResult) =>
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
                    if (position.createConstructionSite(key as BuildableStructureConstant) === OK)
                    {
                        log.info(`Site created for ${key} at ${position} `);
                        siteCount++;
                    }

                    if (siteCount >= this.maxSites)
                    {
                        return;
                    }
                }
            }
        }
    }

    private getBuildableRCL(room: Room, rcl: number): number
    {
        if (RCLPlan.isFinished(room, rcl - 1))
        {
            return rcl;
        }

        return this.getBuildableRCL(room, rcl - 1);
    }
}
