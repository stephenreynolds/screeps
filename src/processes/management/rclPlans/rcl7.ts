import { RCLPlan } from "./rclPlan";

export class RCL7 extends RCLPlan
{
    protected rcl = 7;

    public generate(): void
    {
        this.init();

        this.addSpawn();
        this.addExtensions();
        this.addExtensionRoads();
        this.addTower();
        this.addLabs();
        this.addLabRoads();
        this.addControllerLink();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL this.rcl - 1
        this.room.memory.roomPlan.rcl[this.rcl].spawn = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].spawn);
        this.room.memory.roomPlan.rcl[this.rcl].road = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].road);
        this.room.memory.roomPlan.rcl[this.rcl].container = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].container);
        this.room.memory.roomPlan.rcl[this.rcl].extension = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].extension);
        this.room.memory.roomPlan.rcl[this.rcl].tower = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].tower);
        this.room.memory.roomPlan.rcl[this.rcl].rampart = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].rampart);
        this.room.memory.roomPlan.rcl[this.rcl].storage = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].storage);
        this.room.memory.roomPlan.rcl[this.rcl].link = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].link);
        this.room.memory.roomPlan.rcl[this.rcl].terminal = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].terminal);
        this.room.memory.roomPlan.rcl[this.rcl].extractor = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].extractor);
        this.room.memory.roomPlan.rcl[this.rcl].lab = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].lab);
        this.room.memory.roomPlan.rcl[this.rcl].constructedWall = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].constructedWall);
    }

    private addSpawn(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].spawn[1] =
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 2, this.room.name);
    }

    private addExtensions(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = this.room.memory.roomPlan.rcl[this.rcl].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 2, this.room.name)
        ]);
    }

    private addExtensionRoads(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 8, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 8, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 8, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 4, this.room.name)
        ]);
    }

    private addTower(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].tower = this.room.memory.roomPlan.rcl[this.rcl].tower.concat([
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 1, this.room.name)
        ]);
    }

    private addLabs(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].lab = this.room.memory.roomPlan.rcl[this.rcl].lab.concat([
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 7, this.room.name)
        ]);
    }

    private addLabRoads(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 8, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 8, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 8, this.room.name)
        ]);
    }

    private addControllerLink(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].link = this.room.memory.roomPlan.rcl[this.rcl].link.concat([
            this.findEmptyInRange(this.controller.pos, 3, this.baseSpawn.pos)
        ]);
    }
}
