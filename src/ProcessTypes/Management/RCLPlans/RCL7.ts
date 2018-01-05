import { RCLPlan } from "./RCLPlan";

export class RCL7 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[7] = {};

        // Copy RCL 6
        this.room.memory.roomPlan.rcl[7].spawn = _.clone(this.room.memory.roomPlan.rcl[6].spawn);
        this.room.memory.roomPlan.rcl[7].road = _.clone(this.room.memory.roomPlan.rcl[6].road);
        this.room.memory.roomPlan.rcl[7].container = _.clone(this.room.memory.roomPlan.rcl[6].container);
        this.room.memory.roomPlan.rcl[7].extension = _.clone(this.room.memory.roomPlan.rcl[6].extension);
        this.room.memory.roomPlan.rcl[7].tower = _.clone(this.room.memory.roomPlan.rcl[6].tower);
        this.room.memory.roomPlan.rcl[7].rampart = _.clone(this.room.memory.roomPlan.rcl[6].rampart);
        this.room.memory.roomPlan.rcl[7].storage = _.clone(this.room.memory.roomPlan.rcl[6].storage);
        this.room.memory.roomPlan.rcl[7].link = _.clone(this.room.memory.roomPlan.rcl[6].link);
        this.room.memory.roomPlan.rcl[7].terminal = _.clone(this.room.memory.roomPlan.rcl[6].terminal);
        this.room.memory.roomPlan.rcl[7].extractor = _.clone(this.room.memory.roomPlan.rcl[6].extractor);
        this.room.memory.roomPlan.rcl[7].lab = _.clone(this.room.memory.roomPlan.rcl[6].lab);

        // Spawn
        this.room.memory.roomPlan.rcl[7].spawn[1] =
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 2, this.room.name);

        // Extensions
        this.room.memory.roomPlan.rcl[7].extension = this.room.memory.roomPlan.rcl[7].extension.concat([
            this.baseSpawn.pos.offset(-4, -3),
            this.baseSpawn.pos.offset(-2, -3),
            this.baseSpawn.pos.offset(5, 5),
            this.baseSpawn.pos.offset(5, 6),
            this.baseSpawn.pos.offset(5, 7),
            this.baseSpawn.pos.offset(4, 6),
            this.baseSpawn.pos.offset(4, 7),
            this.baseSpawn.pos.offset(3, 7),
            this.baseSpawn.pos.offset(5, -1),
            this.baseSpawn.pos.offset(4, -2)
        ]);

        // Extension roads
        this.room.memory.roomPlan.rcl[7].road = this.room.memory.roomPlan.rcl[7].road.concat([
            this.baseSpawn.pos.offset(3, 8),
            this.baseSpawn.pos.offset(4, 8),
            this.baseSpawn.pos.offset(5, 8),
            this.baseSpawn.pos.offset(6, 7),
            this.baseSpawn.pos.offset(6, 6),
            this.baseSpawn.pos.offset(6, 5),
            this.baseSpawn.pos.offset(6, -1),
            this.baseSpawn.pos.offset(6, -2),
            this.baseSpawn.pos.offset(6, -3),
            this.baseSpawn.pos.offset(5, -4),
            this.baseSpawn.pos.offset(4, -4)
        ]);

        // Tower
        this.room.memory.roomPlan.rcl[7].tower = this.room.memory.roomPlan.rcl[7].tower.concat([
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 1, this.room.name)
        ]);

        // Labs
        this.room.memory.roomPlan.rcl[7].lab = this.room.memory.roomPlan.rcl[7].lab.concat([
            this.baseSpawn.pos.offset(-5, 6),
            this.baseSpawn.pos.offset(-4, 6),
            this.baseSpawn.pos.offset(-4, 7)
        ]);

        // Lab Roads
        this.room.memory.roomPlan.rcl[7].road = this.room.memory.roomPlan.rcl[7].road.concat([
            this.baseSpawn.pos.offset(-6, 5),
            this.baseSpawn.pos.offset(-6, 6),
            this.baseSpawn.pos.offset(-6, 7),
            this.baseSpawn.pos.offset(-5, 8),
            this.baseSpawn.pos.offset(-4, 8),
            this.baseSpawn.pos.offset(-3, 8)
        ]);

        // Controller Link
        this.room.memory.roomPlan.rcl[7].link = this.room.memory.roomPlan.rcl[7].link.concat([
            this.findEmptyInRange(this.controller.pos, 3, this.baseSpawn.pos)
        ]);

        this.finished(7);
    }
}
