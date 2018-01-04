import { RCLPlan } from "./RCLPlan";

export class RCL7 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[7] = {};
        this.room.memory.roomPlan.rcl[7].spawn = _.clone(this.room.memory.roomPlan.rcl[6].spawn);
        this.room.memory.roomPlan.rcl[7].road = _.clone(this.room.memory.roomPlan.rcl[6].road);
        this.room.memory.roomPlan.rcl[7].container = _.clone(this.room.memory.roomPlan.rcl[6].container);
        this.room.memory.roomPlan.rcl[7].extension = _.clone(this.room.memory.roomPlan.rcl[6].extension);
        this.room.memory.roomPlan.rcl[7].tower = _.clone(this.room.memory.roomPlan.rcl[6].tower);
        this.room.memory.roomPlan.rcl[7].rampart = _.clone(this.room.memory.roomPlan.rcl[6].rampart);
        this.room.memory.roomPlan.rcl[7].storage = _.clone(this.room.memory.roomPlan.rcl[6].storage);
        this.room.memory.roomPlan.rcl[7].link = _.clone(this.room.memory.roomPlan.rcl[6].link);
        this.room.memory.roomPlan.rcl[7].terminal = _.clone(this.room.memory.roomPlan.rcl[6].terminal);
        this.room.memory.roomPlan.rcl[7].spawn[1] =
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y, this.room.name);
        this.room.memory.roomPlan.rcl[7].extension = this.room.memory.roomPlan.rcl[7].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 5, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[7].road = this.room.memory.roomPlan.rcl[7].road.concat([
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 4, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[7].tower = this.room.memory.roomPlan.rcl[7].tower.concat([
            this.findEmptyInRange(this.controller.pos, 2, this.baseSpawn.pos)
        ]);

        this.finished(7);
    }
}
