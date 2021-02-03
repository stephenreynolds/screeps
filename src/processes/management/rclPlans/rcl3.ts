import { RCLPlan } from "./rclPlan";

export class RCL3 extends RCLPlan
{
    protected rcl = 3;

    public generate(): void
    {
        this.init();

        this.addExtensions();
        this.addExtensionRoads();
        this.addTower();
        this.addWalls();
        this.addRamparts();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL 2
        this.room.memory.roomPlan.rcl[this.rcl].spawn = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].spawn);
        this.room.memory.roomPlan.rcl[this.rcl].road = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].road);
        this.room.memory.roomPlan.rcl[this.rcl].container = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].container);
        this.room.memory.roomPlan.rcl[this.rcl].extension = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].extension);

        // Initialize arrays
        this.room.memory.roomPlan.rcl[this.rcl].rampart = [];
    }

    private addExtensions(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = this.room.memory.roomPlan.rcl[this.rcl].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 3, this.room.name)
        ]);
    }

    private addExtensionRoads(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 6, this.room.name)
        ]);
    }

    private addTower(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].tower = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 1, this.room.name)
        ];
    }

    private addWalls(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].constructedWall = [];
        const exitPositions = this.room.find(FIND_EXIT);
        const costs = new PathFinder.CostMatrix;
        _.forEach(this.room.find(FIND_STRUCTURES), (s: Structure) =>
        {
            costs.set(s.pos.x, s.pos.y, 255);
        });
        for (const pos of exitPositions)
        {
            let path: PathFinderPath | undefined;
            do
            {
                // path = this.room.findPath(pos, this.baseSpawn.pos, {
                //     ignoreCreeps: true,
                //     swampCost: 1,
                //     costCallback: () => costs
                // });

                // if (path.length !== 0)
                // {
                //     for (const p of path)
                //     {
                //         if (p.x === 2 || p.y === 2 || p.x === 47 || p.y === 47)
                //         {
                //             this.room.memory.roomPlan.rcl[3].constructedWall.push(new RoomPosition(p.x, p.y, this.room.name));
                //             costs.set(p.x, p.y, 255);
                //             break;
                //         }
                //     }
                // }

                path = PathFinder.search(pos, this.baseSpawn.pos,
                    {
                        maxRooms: 1,
                        swampCost: 1,
                        roomCallback: () => costs
                    });

                if (!path.incomplete)
                {
                    for (const p of path.path)
                    {
                        if (p.x === 2 || p.y === 2 || p.x === 47 || p.y === 47)
                        {
                            this.room.memory.roomPlan.rcl[this.rcl].constructedWall.push(new RoomPosition(p.x, p.y, this.room.name));
                            costs.set(p.x, p.y, 255);
                            break;
                        }
                    }
                }
            } while (path && !path.incomplete);
        }
    }

    private addRamparts(): void
    {
        this.replaceNearestWall(TOP);
        this.replaceNearestWall(BOTTOM);
        this.replaceNearestWall(LEFT);
        this.replaceNearestWall(RIGHT);
    }

    private replaceNearestWall(direction: DirectionConstant): void
    {
        let closest = -1;
        let distance = 99;
        for (let i = 0; i < this.room.memory.roomPlan.rcl[this.rcl].constructedWall.length; ++i)
        {
            const wall = this.room.memory.roomPlan.rcl[this.rcl].constructedWall[i];

            if (direction === TOP && wall.y !== 2) continue;
            if (direction === BOTTOM && wall.y !== 47) continue;
            if (direction === LEFT && wall.x !== 2) continue;
            if (direction === RIGHT && wall.x !== 47) continue;

            const a = wall.x - this.baseSpawn.pos.x;
            const b = wall.y - this.baseSpawn.pos.y;
            const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            if (c < distance)
            {
                distance = c;
                closest = i;
            }
        }
        if (closest !== -1)
        {
            this.room.memory.roomPlan.rcl[this.rcl].rampart.push(this.room.memory.roomPlan.rcl[this.rcl].constructedWall[closest]);
            this.room.memory.roomPlan.rcl[this.rcl].constructedWall.splice(closest, 1);
        }
    }
}
