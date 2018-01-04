import { RCLPlan } from "ProcessTypes/Management/RCLPlans/RCLPlan";

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

        this.finished(3);
    }
}
