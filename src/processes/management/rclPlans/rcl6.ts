import { RCLPlan } from "./rclPlan";

export class RCL6 extends RCLPlan
{
    protected rcl = 6;

    public generate(): void
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

    private addTerminal(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].terminal = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 4, this.room.name)
        ];
    }

    private addExtensions(): void
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

    private addExtensionRoads(): void
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

    private addExtractor(): void
    {
        const mineral = this.scheduler.data.roomData[this.room.name].mineral;
        if (mineral)
        {
            this.room.memory.roomPlan.rcl[this.rcl].extractor = [mineral.pos];

            // Extractor container
            const emptyPos = this.findEmptyInRange(mineral.pos, 1, this.baseSpawn.pos);
            if (!emptyPos)
            {
                console.log("Mineral inaccessible. No empty positions.");
                return;
            }
            const extractorContainerPos = emptyPos;
            this.room.memory.roomPlan.rcl[this.rcl].container.push(extractorContainerPos);

            // Extractor container roads
            for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: extractorContainerPos, range: 1 }).path)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(pos);
            }
        }
    }

    private addLabs(): void
    {
        this.room.memory.roomPlan.rcl[6].lab = [
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 5, this.room.name)
        ];
    }

    private addLink(): void
    {
        const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[6].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.scheduler.data.roomData[this.room.name].sources, 1) &&
                !c.findInRange(this.scheduler.data.roomData[this.room.name].links, 1);
        });
        if (sourceContainers[0])
        {
            const closest = this.baseSpawn.pos.findClosestByRange(sourceContainers);
            if (!closest)
            {
                console.log("A source container exists, but could not be found.");
                return;
            }

            this.room.memory.roomPlan.rcl[6].link = this.room.memory.roomPlan.rcl[6].link.concat([
                this.findEmptyInRange(closest, 1, this.baseSpawn.pos)
            ]);
        }
    }
}
