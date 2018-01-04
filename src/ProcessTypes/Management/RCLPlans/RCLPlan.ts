import { log } from "Lib/Logger/Log";
import { Kernel } from "OS/Kernel";
import { BuildPriorities } from "./BuildPriorities";

export abstract class RCLPlan
{
    protected room: Room;
    protected kernel: Kernel;
    protected baseSpawn: StructureSpawn;
    protected controller: StructureController;
    protected midpoint: RoomPosition;

    public constructor(room: Room, kernel: Kernel)
    {
        this.room = room;
        this.kernel = kernel;

        this.baseSpawn = _.find(this.kernel.data.roomData[this.room.name].spawns, (s) =>
        {
            return s.name === "base-" + this.room.name || s.name === "Spawn1"; // TODO: remove Spawn1 ASAP
        })!;

        this.controller = room.controller!;

        this.midpoint = new RoomPosition(
            Math.round((this.baseSpawn.pos.x + this.controller.pos.x) / 2),
            Math.round((this.baseSpawn.pos.y + this.controller.pos.y) / 2), this.room.name);
    }

    public abstract generate(): void;

    public static isFinished(room: Room, rcl: number): boolean
    {
        const roomPlan = room.memory.roomPlan.rcl[rcl];

        for (const key of BuildPriorities)
        {
            if (!roomPlan.hasOwnProperty(key))
            {
                continue;
            }

            // Get each position...
            for (const position in roomPlan[key])
            {
                const pos = new RoomPosition(roomPlan[key][position].x,
                    roomPlan[key][position].y, room.name);

                // Check if structure exists here.
                const structures = _.filter(pos.look(), (r) =>
                {
                    if (r.type === "structure")
                    {
                        return r.structure!.structureType === key;
                    }
                    else
                    {
                        return false;
                    }
                });

                // Create construction site if nothing is here.
                if (structures.length === 0)
                {
                    return false;
                }
            }
        }

        return true;
    }

    protected finished(rcl: number)
    {
        log.debug(`Plan for ${this.room.name} RCL ${rcl} generated successfully.`);
    }

    protected findEmptyInRange(origin: RoomPosition, range: number, nearestTo?: RoomPosition): RoomPosition | undefined
    {
        const empties: RoomPosition[] = [];
        for (let y = origin.y - range; y <= origin.y + range; y++)
        {
            for (let x = origin.x - range; x <= origin.x + range; x++)
            {
                if (this.room.lookForAt(LOOK_TERRAIN, x, y).indexOf("wall") === -1)
                {
                    const pos = new RoomPosition(x, y, this.room.name);

                    if (nearestTo)
                    {
                        empties.push(pos);
                    }
                    else
                    {
                        return pos;
                    }
                }
            }
        }

        if (empties.length > 0 && nearestTo)
        {
            return nearestTo.findClosestByPath(empties);
        }

        return undefined;
    }
}
