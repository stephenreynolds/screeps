import { BuildPriorities } from "./rclPlans/buildPriorities";
import { Process } from "processes/process";
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

    public run(): void
    {
        const room = Game.rooms[this.metaData.roomName];

        if (!(room && room.controller))
        {
            delete Memory.rooms[this.metaData.roomName];
            this.completed = true;
            return;
        }

        if (room.memory.roomPlan && room.memory.roomPlan.rcl.length === 9)
        {
            const siteCount = room.memory.numSites;

            if (siteCount < this.maxSites && !RCLPlan.isFinished(room, room.controller.level))
            {
                this.createSites(room);
            }
        }
        else
        {
            this.generateRoomPlan(room);
        }
    }

    private generateRoomPlan(room: Room): void
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
    }

    private createSites(room: Room): void
    {
        if (!room.controller)
        {
            console.log("Room layout management tried to create sites in a non-owned room.");
            return;
        }

        const buildableRCL = this.getBuildableRCL(room, room.controller.level);
        const roomPlan = room.memory.roomPlan.rcl[buildableRCL];
        let siteCount = room.memory.numSites;

        // For each building...
        for (const key of BuildPriorities)
        {
            if (!Object.prototype.hasOwnProperty.call(roomPlan, key))
            {
                continue;
            }

            // Get each position...
            for (const structure of roomPlan[key])
            {
                const position = new RoomPosition(structure.x, structure.y, room.name);

                // Check if structure or construction site already exists here.
                // Check if structure or construction site already exists here.
                const structures = _.filter(position.look(), (r: LookAtResult) =>
                {
                    if (r.type === "structure" && r.structure)
                    {
                        return r.structure.structureType === key;
                    }
                    else if (r.type === "constructionSite" && r.constructionSite)
                    {
                        return r.constructionSite.structureType === key;
                    }
                    else
                    {
                        return false;
                    }
                });

                // Create construction site if nothing is here.
                if (structures.length === 0)
                {
                    const result = position.createConstructionSite(key as BuildableStructureConstant);
                    if (result === OK)
                    {
                        console.log(`Site created for ${key} at ${position} `);
                        siteCount++;
                    }
                    else
                    {
                        console.log(`Failed to create ${key} at ${position}. Error: ${result}`);
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
