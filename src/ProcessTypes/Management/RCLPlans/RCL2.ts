import { RCLPlan } from "./RCLPlan";

export class RCL2 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[2] = {};

        // Copy RCL 1
        this.room.memory.roomPlan.rcl[2].spawn = _.clone(this.room.memory.roomPlan.rcl[1].spawn);

        // Source containers
        this.room.memory.roomPlan.rcl[2].container = [];
        for (const source of this.kernel.data.roomData[this.room.name].sources)
        {
            this.room.memory.roomPlan.rcl[2].container.push(this.findEmptyInRange(source.pos, 1, this.baseSpawn.pos)!);
        }

        // General container
        const generalContainerPos = this.findEmptyInRange(this.midpoint, 5)!;
        this.room.memory.roomPlan.rcl[2].container.push(generalContainerPos);

        // Source roads
        this.room.memory.roomPlan.rcl[2].road = [];
        for (const s of this.kernel.data.roomData[this.room.name].sources)
        {
            for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: s.pos, range: 1 }).path)
            {
                this.room.memory.roomPlan.rcl[2].road.push(pos);
            }
        }

        // General container roads
        for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: generalContainerPos, range: 1 }).path)
        {
            this.room.memory.roomPlan.rcl[2].road.push(pos);
        }

        // Controller roads
        for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: this.controller.pos, range: 1 }).path)
        {
            this.room.memory.roomPlan.rcl[2].road.push(pos);
        }

        // Base roads
        this.room.memory.roomPlan.rcl[2].road = this.room.memory.roomPlan.rcl[2].road.concat([  // Base roads
            // Top to right
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 2, this.room.name),
            // Right to bottom
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 5, this.room.name),
            // Bottom to left
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 2, this.room.name),
            // Left to top
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y, this.room.name)
        ]);

        // Extensions
        this.room.memory.roomPlan.rcl[2].extension = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 1, this.room.name)
        ];

        // Extension roads
        this.room.memory.roomPlan.rcl[2].road = this.room.memory.roomPlan.rcl[2].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 1, this.room.name)
        ]);

        this.finished(2);
    }
}
