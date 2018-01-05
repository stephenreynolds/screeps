import { RCLPlan } from "./RCLPlan";

export class RCL6 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[6] = {};

        // Copy RCL 5
        this.room.memory.roomPlan.rcl[6].spawn = _.clone(this.room.memory.roomPlan.rcl[5].spawn);
        this.room.memory.roomPlan.rcl[6].road = _.clone(this.room.memory.roomPlan.rcl[5].road);
        this.room.memory.roomPlan.rcl[6].container = _.clone(this.room.memory.roomPlan.rcl[5].container);
        this.room.memory.roomPlan.rcl[6].extension = _.clone(this.room.memory.roomPlan.rcl[5].extension);
        this.room.memory.roomPlan.rcl[6].tower = _.clone(this.room.memory.roomPlan.rcl[5].tower);
        this.room.memory.roomPlan.rcl[6].rampart = _.clone(this.room.memory.roomPlan.rcl[5].rampart);
        this.room.memory.roomPlan.rcl[6].storage = _.clone(this.room.memory.roomPlan.rcl[5].storage);
        this.room.memory.roomPlan.rcl[6].link = _.clone(this.room.memory.roomPlan.rcl[5].link);

        // Terminal
        this.room.memory.roomPlan.rcl[6].terminal = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 4, this.room.name)
        ];

        // Extensions
        this.room.memory.roomPlan.rcl[6].extension = this.room.memory.roomPlan.rcl[6].extension.concat([
            this.baseSpawn.pos.offset(2, 5),
            this.baseSpawn.pos.offset(2, 6),
            this.baseSpawn.pos.offset(-4, 2),
            this.baseSpawn.pos.offset(-5, 2),
            this.baseSpawn.pos.offset(-5, 3),
            this.baseSpawn.pos.offset(-5, 1),
            this.baseSpawn.pos.offset(-5, -1),
            this.baseSpawn.pos.offset(-5, -2),
            this.baseSpawn.pos.offset(-5, -3),
            this.baseSpawn.pos.offset(-5, -2)
        ]);

        // Extension Roads
        this.room.memory.roomPlan.rcl[6].road = this.room.memory.roomPlan.rcl[6].road.concat([
            this.baseSpawn.pos.offset(-6, 3),
            this.baseSpawn.pos.offset(-6, 2),
            this.baseSpawn.pos.offset(-6, 1),
            this.baseSpawn.pos.offset(-6, -1),
            this.baseSpawn.pos.offset(-6, -2),
            this.baseSpawn.pos.offset(-6, -3),
            this.baseSpawn.pos.offset(-5, -4),
            this.baseSpawn.pos.offset(-4, -4),
            this.baseSpawn.pos.offset(-3, -4)
        ]);

        // Extractor
        this.room.memory.roomPlan.rcl[6].extractor = [this.kernel.data.roomData[this.room.name].mineral!.pos];

        // Labs
        this.room.memory.roomPlan.rcl[6].lab = [
            this.baseSpawn.pos.offset(-3, 4),
            this.baseSpawn.pos.offset(-3, 5),
            this.baseSpawn.pos.offset(-2, 5)
        ];

        // Extractor container
        const extractorContainerPos = this.findEmptyInRange(
            this.kernel.data.roomData[this.room.name].mineral!.pos, 1, this.baseSpawn.pos)!;
        this.room.memory.roomPlan.rcl[6].container.push(extractorContainerPos);

        // Extractor container roads
        for (const pos of PathFinder.search(this.baseSpawn.pos, { pos: extractorContainerPos, range: 1 }).path)
        {
            this.room.memory.roomPlan.rcl[6].road.push(pos);
        }

        // Second source link
        const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[6].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.kernel.data.roomData[this.room.name].sources, 1) &&
                !c.findInRange(this.kernel.data.roomData[this.room.name].links, 1);
        }) as RoomPosition[];
        if (sourceContainers[0])
        {
            this.room.memory.roomPlan.rcl[6].link = this.room.memory.roomPlan.rcl[6].link.concat([
                this.findEmptyInRange(this.baseSpawn.pos.findClosestByRange(sourceContainers), 1, this.baseSpawn.pos)
            ]);
        }

        this.finished(6);
    }
}
