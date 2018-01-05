import { RCLPlan } from "./RCLPlan";

export class RCL8 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[8] = {};

        // Copy RCL 7
        this.room.memory.roomPlan.rcl[8].spawn = _.clone(this.room.memory.roomPlan.rcl[7].spawn);
        this.room.memory.roomPlan.rcl[8].road = _.clone(this.room.memory.roomPlan.rcl[7].road);
        this.room.memory.roomPlan.rcl[8].container = _.clone(this.room.memory.roomPlan.rcl[7].container);
        this.room.memory.roomPlan.rcl[8].extension = _.clone(this.room.memory.roomPlan.rcl[7].extension);
        this.room.memory.roomPlan.rcl[8].tower = _.clone(this.room.memory.roomPlan.rcl[7].tower);
        this.room.memory.roomPlan.rcl[8].rampart = _.clone(this.room.memory.roomPlan.rcl[7].rampart);
        this.room.memory.roomPlan.rcl[8].storage = _.clone(this.room.memory.roomPlan.rcl[7].storage);
        this.room.memory.roomPlan.rcl[8].link = _.clone(this.room.memory.roomPlan.rcl[7].link);
        this.room.memory.roomPlan.rcl[8].terminal = _.clone(this.room.memory.roomPlan.rcl[7].terminal);
        this.room.memory.roomPlan.rcl[8].lab = _.clone(this.room.memory.roomPlan.rcl[7].lab);

        // Spawns
        this.room.memory.roomPlan.rcl[8].spawn[2] =
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 2, this.room.name);

        // Extensions
        this.room.memory.roomPlan.rcl[8].extension = this.room.memory.roomPlan.rcl[8].extension.concat([
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

        // Towers
        this.room.memory.roomPlan.rcl[8].tower = this.room.memory.roomPlan.rcl[8].tower.concat([
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 2, this.room.name)
        ]);

        // Labs
        this.room.memory.roomPlan.rcl[8].lab = this.room.memory.roomPlan.rcl[8].lab.concat([
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 7, this.room.name)
        ]);

        // Observer
        this.room.memory.roomPlan.rcl[8].observer = [
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 7, this.room.name)
        ];

        // Power Spawn
        this.room.memory.roomPlan.rcl[8].powerSpawn = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 4, this.room.name)
        ];

        // Nuker
        this.room.memory.roomPlan.rcl[8].nuker = [
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 8, this.room.name)
        ];

        // Third and forth source links
        const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[8].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.kernel.data.roomData[this.room.name].sources, 1) &&
                !c.findInRange(this.kernel.data.roomData[this.room.name].links, 1);
        }) as RoomPosition[];

        if (sourceContainers[0])
        {
            if (sourceContainers[1])
            {
                this.room.memory.roomPlan.rcl[8].link = this.room.memory.roomPlan.rcl[8].link.concat([
                    this.findEmptyInRange(sourceContainers[0], 1, this.baseSpawn.pos)
                ]);
            }
            else
            {
                this.room.memory.roomPlan.rcl[8].link = this.room.memory.roomPlan.rcl[8].link.concat([
                    this.findEmptyInRange(sourceContainers[1], 1, this.baseSpawn.pos)
                ]);
            }
        }

        this.finished(8);
    }
}
