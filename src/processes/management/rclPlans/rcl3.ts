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
        for (const pos of exitPositions)
        {
            let x = 0;
            let y = 0;

            if (pos.x === 0)
            {
                x = pos.x + 2;
            }
            else if (pos.x === 49)
            {
                x = pos.x - 2;
            }
            else
            {
                x = pos.x;
            }

            if (pos.y === 0)
            {
                y = pos.y + 2;
            }
            else if (pos.y === 49)
            {
                y = pos.y - 2;
            }
            else
            {
                y = pos.y;
            }

            this.room.memory.roomPlan.rcl[3].constructedWall.push(new RoomPosition(x, y, this.room.name));
        }

        // Ramparts
        this.room.memory.roomPlan.rcl[3].rampart = [];
        for (let i = 0; i < 3; ++i)
        {
            this.rampartPass(exitPositions);
        }

        this.finished(3);
    }

    private rampartPass(exitPositions: RoomPosition[])
    {
        for (const pos of exitPositions)
        {
            const path = PathFinder.search(this.midpoint, pos,
                {
                    swampCost: 1,
                    roomCallback: (roomName: string) =>
                    {
                        const costs = new PathFinder.CostMatrix;

                        for (const wallPos of this.room.memory.roomPlan.rcl[3].constructedWall)
                        {
                            costs.set(wallPos.x, wallPos.y, 255);
                        }
                        for (const rampartPos of this.room.memory.roomPlan.rcl[3].rampart)
                        {
                            costs.set(rampartPos.x, rampartPos.y, 255);
                        }

                        return costs;
                    }
                });

            for (const pathPos of path.path)
            {
                if (pathPos.inRangeTo(pos, 2))
                {
                    this.room.memory.roomPlan.rcl[3].rampart.push(pathPos);
                }
            }
        }
    }
}
