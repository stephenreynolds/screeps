import { Scheduler } from "scheduler";

import { BuildPriorities } from "./buildPriorities";

export abstract class RCLPlan
{
    protected room: Room;
    protected scheduler: Scheduler;
    protected baseSpawn: StructureSpawn;
    protected controller: StructureController;
    protected midpoint: RoomPosition;
    protected terrain: RoomTerrain;

    public constructor(room: Room, scheduler: Scheduler)
    {
        this.room = room;
        this.scheduler = scheduler;

        this.baseSpawn = _.find(this.scheduler.data.roomData[this.room.name].spawns, (s: StructureSpawn) =>
        {
            return s.name === "base-" + this.room.name;
        })!;

        this.controller = room.controller!;

        this.midpoint = new RoomPosition(
            Math.round((this.baseSpawn.pos.x + this.controller.pos.x) / 2),
            Math.round((this.baseSpawn.pos.y + this.controller.pos.y) / 2), this.room.name);

        this.terrain = new Room.Terrain(this.room.name);
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
                const structures = pos.lookFor(LOOK_STRUCTURES);

                if (!_.any(structures, (s: Structure) => s.structureType === key))
                {
                    return false;
                }
            }
        }

        return true;
    }

    protected finished(rcl: number)
    {
        this.removeUnbuildablePositions(rcl);
        this.removeRoadsUnderStructures(rcl);
        console.log(`Plan for ${this.room.name} RCL ${rcl} generated successfully.`);
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
                        const terrain = Game.map.getRoomTerrain(this.room.name);

                        if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_WALL)
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
            return nearestTo.findClosestByPath(empties)!;
        }

        return undefined;
    }

    protected isBuildablePos(x: number, y: number): boolean
    {
        if (this.terrain.get(x, y) !== TERRAIN_MASK_WALL)
        {
            if (x > 1 && x < 48 && y > 1 && y < 48)
            {
                return true;
            }
        }

        return false;
    }

    private removeRoadsUnderStructures(rcl: number)
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

                const roads = this.room.memory.roomPlan.rcl[rcl][STRUCTURE_ROAD];
                _.remove(roads, (p: RoomPosition) =>
                {
                    const roadPosition = new RoomPosition(p.x, p.y, this.room.name);
                    return position === roadPosition;
                });
                this.room.memory.roomPlan.rcl[rcl][STRUCTURE_ROAD] = roads;
            }
        }
    }

    private removeUnbuildablePositions(rcl: number)
    {
        const roomPlan = this.room.memory.roomPlan.rcl[rcl];

        for (const key of BuildPriorities)
        {
            if (!roomPlan.hasOwnProperty(key))
            {
                continue;
            }

            _.remove(roomPlan[key], (p: any) => !this.isBuildablePos(p.x, p.y));
        }
    }
}
