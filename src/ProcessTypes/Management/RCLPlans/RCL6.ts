import { RCLPlan } from "./RCLPlan";

export class RCL6 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[6] = {};
        this.room.memory.roomPlan.rcl[6].spawn = _.clone(this.room.memory.roomPlan.rcl[5].spawn);
        this.room.memory.roomPlan.rcl[6].road = _.clone(this.room.memory.roomPlan.rcl[5].road);
        this.room.memory.roomPlan.rcl[6].container = _.clone(this.room.memory.roomPlan.rcl[5].container);
        this.room.memory.roomPlan.rcl[6].extension = _.clone(this.room.memory.roomPlan.rcl[5].extension);
        this.room.memory.roomPlan.rcl[6].tower = _.clone(this.room.memory.roomPlan.rcl[5].tower);
        this.room.memory.roomPlan.rcl[6].rampart = _.clone(this.room.memory.roomPlan.rcl[5].rampart);
        this.room.memory.roomPlan.rcl[6].storage = _.clone(this.room.memory.roomPlan.rcl[5].storage);
        this.room.memory.roomPlan.rcl[6].link = _.clone(this.room.memory.roomPlan.rcl[5].link);
        this.room.memory.roomPlan.rcl[6].terminal = [
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 3, this.room.name)
        ];
        this.room.memory.roomPlan.rcl[6].extension = this.room.memory.roomPlan.rcl[6].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[6].road = this.room.memory.roomPlan.rcl[6].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 7, this.baseSpawn.pos.y + 1, this.room.name)
        ]);
        this.room.memory.roomPlan.rcl[6].extractor = this.kernel.data.roomData[this.room.name].mineral!.pos;

        this.finished(6);
    }
}
