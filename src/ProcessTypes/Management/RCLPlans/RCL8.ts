import { RCLPlan } from "./RCLPlan";

export class RCL8 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[8] = {};
        this.room.memory.roomPlan.rcl[8].spawn = _.clone(this.room.memory.roomPlan.rcl[7].spawn);
        this.room.memory.roomPlan.rcl[8].road = _.clone(this.room.memory.roomPlan.rcl[7].road);
        this.room.memory.roomPlan.rcl[8].container = _.clone(this.room.memory.roomPlan.rcl[7].container);
        this.room.memory.roomPlan.rcl[8].extension = _.clone(this.room.memory.roomPlan.rcl[7].extension);
        this.room.memory.roomPlan.rcl[8].tower = _.clone(this.room.memory.roomPlan.rcl[7].tower);
        this.room.memory.roomPlan.rcl[8].rampart = _.clone(this.room.memory.roomPlan.rcl[7].rampart);
        this.room.memory.roomPlan.rcl[8].storage = _.clone(this.room.memory.roomPlan.rcl[7].storage);
        this.room.memory.roomPlan.rcl[8].link = _.clone(this.room.memory.roomPlan.rcl[7].link);
        this.room.memory.roomPlan.rcl[8].terminal = _.clone(this.room.memory.roomPlan.rcl[7].terminal);
        this.room.memory.roomPlan.rcl[8].spawn[2] =
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 1, this.room.name);
        this.room.memory.roomPlan.rcl[8].extension = this.room.memory.roomPlan.rcl[8].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 4, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[8].road = this.room.memory.roomPlan.rcl[8].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 4, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[8].tower = this.room.memory.roomPlan.rcl[8].tower.concat([
            this.findEmptyInRange(new RoomPosition(this.midpoint.x + 2, this.midpoint.y + 2, this.room.name), 5),
            new RoomPosition(this.baseSpawn.pos.x + 8, this.baseSpawn.pos.y - 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 8, this.room.name)
        ]);

        this.finished(8);
    }
}
