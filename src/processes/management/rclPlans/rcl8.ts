import { RCLPlan } from "./rclPlan";

export class RCL8 extends RCLPlan
{
    protected rcl: number = 8;

    public generate()
    {
        this.init();

        this.addSpawn();
        this.addExtensions();
        this.addTowers();
        this.addLabs();
        this.addObserver();
        this.addPowerSpawn();
        this.addNuker();
        this.addLinks();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL 7
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

    private addSpawn()
    {
        this.room.memory.roomPlan.rcl[this.rcl].spawn[2] =
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 2, this.room.name);
    }

    private addExtensions()
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = this.room.memory.roomPlan.rcl[this.rcl].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 4, this.room.name)
        ]);
    }

    private addTowers()
    {
        this.room.memory.roomPlan.rcl[this.rcl].tower = this.room.memory.roomPlan.rcl[this.rcl].tower.concat([
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 2, this.room.name)
        ]);
    }

    private addLabs()
    {
        this.room.memory.roomPlan.rcl[this.rcl].lab = this.room.memory.roomPlan.rcl[this.rcl].lab.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 7, this.room.name)
        ]);
    }

    private addObserver()
    {
        this.room.memory.roomPlan.rcl[this.rcl].observer = [
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 7, this.room.name)
        ];
    }

    private addPowerSpawn()
    {
        this.room.memory.roomPlan.rcl[this.rcl].powerSpawn = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 4, this.room.name)
        ];
    }

    private addNuker()
    {
        this.room.memory.roomPlan.rcl[this.rcl].nuker = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 8, this.room.name)
        ];
    }

    private addLinks()
    {
        const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[this.rcl].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.scheduler.data.roomData[this.room.name].sources, 1) &&
                !c.findInRange(this.scheduler.data.roomData[this.room.name].links, 1);
        }) as RoomPosition[];

        if (sourceContainers[0])
        {
            if (sourceContainers[1])
            {
                this.room.memory.roomPlan.rcl[this.rcl].link = this.room.memory.roomPlan.rcl[this.rcl].link.concat([
                    this.findEmptyInRange(sourceContainers[0], 1, this.baseSpawn.pos)
                ]);
            }
            else
            {
                this.room.memory.roomPlan.rcl[this.rcl].link = this.room.memory.roomPlan.rcl[this.rcl].link.concat([
                    this.findEmptyInRange(sourceContainers[1], 1, this.baseSpawn.pos)
                ]);
            }
        }
    }
}
