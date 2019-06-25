import { Process } from "processes/process";

import { BuildPriorities } from "./rclPlans/buildPriorities";
import { RCL0 } from "./rclPlans/rcl0";
import { RCL1 } from "./rclPlans/rcl1";
import { RCL2 } from "./rclPlans/rcl2";
import { RCL3 } from "./rclPlans/rcl3";
import { RCL4 } from "./rclPlans/rcl4";
import { RCL5 } from "./rclPlans/rcl5";
import { RCL6 } from "./rclPlans/rcl6";
import { RCL7 } from "./rclPlans/rcl7";
import { RCL8 } from "./rclPlans/rcl8";
import { RCLPlan } from "./rclPlans/rclPlan";

export class RoomLayoutManagementProcess extends Process
{
    public type = "roomlayout";

    public readonly maxSites = 10;  // Max number of sites per room.

    public run()
    {
        const room = Game.rooms[this.metaData.roomName];

        if (!room)
        {
            delete Memory.rooms[this.metaData.roomName];
            this.completed = true;
            return;
        }

        if (room.memory.roomPlan)
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
        room.memory.roomPlan = {};
        room.memory.roomPlan.rcl = [];

        new RCL0(room, this.scheduler).generate();
        new RCL1(room, this.scheduler).generate();
        new RCL2(room, this.scheduler).generate();
        new RCL3(room, this.scheduler).generate();
        new RCL4(room, this.scheduler).generate();
        new RCL5(room, this.scheduler).generate();
        new RCL6(room, this.scheduler).generate();
        new RCL7(room, this.scheduler).generate();
        new RCL8(room, this.scheduler).generate();

        room.memory.roomPlan.generated = true;
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
            for (let i = 0; i < roomPlan[key].length; ++i)
            {
                const position = new RoomPosition(
                    roomPlan[key][i].x, roomPlan[key][i].y, room.name);

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
                        console.log(`Site created for ${key} at ${position} `);
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
