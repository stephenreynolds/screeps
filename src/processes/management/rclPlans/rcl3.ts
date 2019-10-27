import { RCLPlan } from "./rclPlan";

export class RCL3 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[3] = {};

        // Copy RCL 2
        this.room.memory.roomPlan.rcl[3].spawn = _.clone(this.room.memory.roomPlan.rcl[2].spawn);
        this.room.memory.roomPlan.rcl[3].road = _.clone(this.room.memory.roomPlan.rcl[2].road);
        this.room.memory.roomPlan.rcl[3].container = _.clone(this.room.memory.roomPlan.rcl[2].container);
        this.room.memory.roomPlan.rcl[3].extension = _.clone(this.room.memory.roomPlan.rcl[2].extension);

        // Extensions
        this.room.memory.roomPlan.rcl[3].extension = this.room.memory.roomPlan.rcl[3].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 3, this.room.name)
        ]);

        // Extension roads
        this.room.memory.roomPlan.rcl[3].road = this.room.memory.roomPlan.rcl[3].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 6, this.room.name)
        ]);

        // Tower
        this.room.memory.roomPlan.rcl[3].tower = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 1, this.room.name)
        ];

        // Walls
        this.room.memory.roomPlan.rcl[3].constructedWall = [];
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

                const path = PathFinder.search(pos, this.baseSpawn.pos,
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
                            this.room.memory.roomPlan.rcl[3].constructedWall.push(new RoomPosition(p.x, p.y, this.room.name));
                            costs.set(p.x, p.y, 255);
                            break;
                        }
                    }
                }
            } while (path && !path.incomplete);
        }

        // Replace the wall nearest to the center with a rampart.
        this.room.memory.roomPlan.rcl[3].rampart = [];
        this.replaceNearestWall(TOP);
        this.replaceNearestWall(BOTTOM);
        this.replaceNearestWall(LEFT);
        this.replaceNearestWall(RIGHT);

        this.finished(3);
    }

    private replaceNearestWall(direction: DirectionConstant)
    {
        let closest: number = -1;
        let distance: number = 99;
        for (let i = 0; i < this.room.memory.roomPlan.rcl[3].constructedWall.length; ++i)
        {
            const wall = this.room.memory.roomPlan.rcl[3].constructedWall[i];

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
            this.room.memory.roomPlan.rcl[3].rampart.push(this.room.memory.roomPlan.rcl[3].constructedWall[closest]);
            this.room.memory.roomPlan.rcl[3].constructedWall.splice(closest, 1);
        }
    }
}
