import { RCLPlan } from "./RCLPlan";

export class RCL2 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[2] = {};
        this.room.memory.roomPlan.rcl[2].spawn = _.clone(this.room.memory.roomPlan.rcl[1].spawn);
        this.room.memory.roomPlan.rcl[2].container = [];
        for (const source of this.kernel.data.roomData[this.room.name].sources)
        {
            this.room.memory.roomPlan.rcl[2].container.push(this.findEmptyInRange(source.pos, 1, this.baseSpawn.pos)!);
        }
        this.room.memory.roomPlan.rcl[2].container.push(this.findEmptyInRange(this.midpoint, 5));
        this.room.memory.roomPlan.rcl[2].road = [];
        for (const s of this.kernel.data.roomData[this.room.name].sources)
        {
            for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: s.pos, range: 1 }).path)
            {
                this.room.memory.roomPlan.rcl[2].road.push(pos);
            }
        }
        for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: this.controller.pos, range: 1 }).path)
        {
            this.room.memory.roomPlan.rcl[2].road.push(pos);
        }
        this.room.memory.roomPlan.rcl[2].road = this.room.memory.roomPlan.rcl[2].road.concat([  // Base roads
            // Top
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 1, this.room.name),
            // Right
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 3, this.room.name),
            // Bottom
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 4, this.room.name),
            // Left
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[2].extension = [
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y, this.room.name)
        ];
        this.room.memory.roomPlan.rcl[2].road = this.room.memory.roomPlan.rcl[2].road.concat([
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 1, this.room.name)
        ]);

        this.finished(2);
    }
}
