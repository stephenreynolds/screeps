import { RCLPlan } from "./rclPlan";

export class RCL6 extends RCLPlan
{
    protected rcl: number = 6;

    public generate()
    {
        this.init();

        this.addTerminal()
        this.addExtensions();
        this.addExtensionRoads();
        this.addExtractor();
        this.addLabs();
        this.addLink();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL 5
        this.room.memory.roomPlan.rcl[this.rcl].spawn = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].spawn);
        this.room.memory.roomPlan.rcl[this.rcl].road = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].road);
        this.room.memory.roomPlan.rcl[this.rcl].container = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].container);
        this.room.memory.roomPlan.rcl[this.rcl].extension = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].extension);
        this.room.memory.roomPlan.rcl[this.rcl].tower = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].tower);
        this.room.memory.roomPlan.rcl[this.rcl].rampart = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].rampart);
        this.room.memory.roomPlan.rcl[this.rcl].storage = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].storage);
        this.room.memory.roomPlan.rcl[this.rcl].link = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].link);
        this.room.memory.roomPlan.rcl[this.rcl].constructedWall = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].constructedWall);
    }

    private addTerminal()
    {
        this.room.memory.roomPlan.rcl[this.rcl].terminal = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 4, this.room.name)
        ];
    }

    private addExtensions()
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = this.room.memory.roomPlan.rcl[this.rcl].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 2, this.room.name)
        ]);
    }

    private addExtensionRoads()
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 4, this.room.name)
        ]);
    }

    private addExtractor()
    {
        const mineral = this.scheduler.data.roomData[this.room.name].mineral;
        if (mineral)
        {
            this.room.memory.roomPlan.rcl[this.rcl].extractor = [mineral.pos];

            // Extractor container
            const extractorContainerPos = this.findEmptyInRange(mineral.pos, 1, this.baseSpawn.pos)!;
            this.room.memory.roomPlan.rcl[this.rcl].container.push(extractorContainerPos);

            // Extractor container roads
            for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: extractorContainerPos, range: 1 }).path)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(pos);
            }
        }
    }

    private addLabs()
    {
        this.room.memory.roomPlan.rcl[6].lab = [
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 5, this.room.name)
        ];
    }

    private addLink()
    {
        const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[6].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.scheduler.data.roomData[this.room.name].sources, 1) &&
                !c.findInRange(this.scheduler.data.roomData[this.room.name].links, 1);
        }) as RoomPosition[];
        if (sourceContainers[0])
        {
            this.room.memory.roomPlan.rcl[6].link = this.room.memory.roomPlan.rcl[6].link.concat([
                this.findEmptyInRange(this.baseSpawn.pos.findClosestByRange(sourceContainers)!, 1, this.baseSpawn.pos)
            ]);
        }
    }
}
