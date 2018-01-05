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

    public static readonly version = 102; // Update this every time generateRoomPlan() changes.

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
        this.removeRoadsUnderStructures(rcl);
        log.debug(`Plan for ${this.room.name} RCL ${rcl} generated successfully.`);
    }

    protected findEmptyInRange(origin: RoomPosition, range: number,
        nearestTo?: RoomPosition, objects: Array<StructureConstant | Terrain> = ["wall"]): RoomPosition | undefined
    {
        const empties: RoomPosition[] = [];
        for (let y = origin.y - range; y <= origin.y + range; y++)
        {
            for (let x = origin.x - range; x <= origin.x + range; x++)
            {
                const pos = new RoomPosition(x, y, this.room.name);
                let empty = true;

                for (const object of objects)
                {
                    if (object === "wall" || object === "plain" || object === "swamp")
                    {
                        if (Game.map.getTerrainAt(pos) === object)
                        {
                            empty = false;
                            break;
                        }
                    }
                    else
                    {
                        const structures = this.room.lookForAt(LOOK_STRUCTURES, pos) as Structure[];

                        for (const structure of structures)
                        {
                            if (structure.structureType === object)
                            {
                                empty = false;
                                break;
                            }
                        }
                    }
                }

                if (empty)
                {
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

    protected removeRoadsUnderStructures(rcl: number)
    {
        const roomPlan = this.room.memory.roomPlan.rcl[rcl];

        for (const key of BuildPriorities)
        {
            if (!roomPlan.hasOwnProperty(key) || key === STRUCTURE_ROAD ||
                key === STRUCTURE_CONTAINER || key === STRUCTURE_RAMPART)
            {
                continue;
            }

            for (const i in roomPlan[key])
            {
                const position = new RoomPosition(roomPlan[key][i].x,
                    roomPlan[key][i].y, this.room.name);

                this.room.memory.roomPlan.rcl[rcl][STRUCTURE_ROAD] = _.remove(
                    this.room.memory.roomPlan.rcl[rcl][STRUCTURE_ROAD], (p: RoomPosition) =>
                    {
                        const roadPosition = new RoomPosition(p.x, p.y, this.room.name);
                        return position === roadPosition;
                    });
            }
        }
    }
}
