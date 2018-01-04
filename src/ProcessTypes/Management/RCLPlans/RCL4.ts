import { RCLPlan } from "./RCLPlan";

export class RCL4 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[4] = {};

        // Copy RCL 4
        this.room.memory.roomPlan.rcl[4].spawn = _.clone(this.room.memory.roomPlan.rcl[3].spawn);
        this.room.memory.roomPlan.rcl[4].road = _.clone(this.room.memory.roomPlan.rcl[3].road);
        this.room.memory.roomPlan.rcl[4].container = _.clone(this.room.memory.roomPlan.rcl[3].container);
        this.room.memory.roomPlan.rcl[4].extension = _.clone(this.room.memory.roomPlan.rcl[3].extension);
        this.room.memory.roomPlan.rcl[4].tower = _.clone(this.room.memory.roomPlan.rcl[3].tower);

        // Storage
        this.room.memory.roomPlan.rcl[4].storage = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 6, this.room.name)
        ];

        // Extensions
        this.room.memory.roomPlan.rcl[4].extension = this.room.memory.roomPlan.rcl[4].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 3, this.room.name)
        ]);

        // Extension roads
        this.room.memory.roomPlan.rcl[4].road = this.room.memory.roomPlan.rcl[4].road.concat([
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 4, this.room.name)
        ]);

        // Ramparts
        this.room.memory.roomPlan.rcl[4].rampart = [];
        for (let x = -5; x <= 5; x++)
        {
            // Top
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y - 4, this.room.name));
        }
        for (let y = -3; y <= 7; y++)
        {
            // Right
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + y, this.room.name));
        }
        for (let x = 5; x >= -5; x--)
        {
            // Bottom
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + 8, this.room.name));
        }
        for (let y = 7; y >= -3; y--)
        {
            // Left
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + y, this.room.name));
        }
        // Corners
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 3, this.room.name));
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 3, this.room.name));
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 7, this.room.name));
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 7, this.room.name));

        this.finished(4);
    }
}
