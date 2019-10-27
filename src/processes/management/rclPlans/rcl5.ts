import { RCLPlan } from "./rclPlan";

export class RCL5 extends RCLPlan
{
    protected rcl: number = 5;

    public generate()
    {
        this.init();

        this.addLinks();
        this.addExtensions();
        this.addExtensionRoads();
        this.addTower();
        this.addRamparts();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL 4
        this.room.memory.roomPlan.rcl[this.rcl].spawn = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].spawn);
        this.room.memory.roomPlan.rcl[this.rcl].road = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].road);
        this.room.memory.roomPlan.rcl[this.rcl].container = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].container);
        this.room.memory.roomPlan.rcl[this.rcl].extension = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].extension);
        this.room.memory.roomPlan.rcl[this.rcl].storage = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].storage);
        this.room.memory.roomPlan.rcl[this.rcl].tower = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].tower);
        this.room.memory.roomPlan.rcl[this.rcl].rampart = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].rampart);
        this.room.memory.roomPlan.rcl[this.rcl].constructedWall = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].constructedWall);
    }

    private addLinks()
    {
        let storageLinkPos: RoomPosition;
        const storagePos = this.room.memory.roomPlan.rcl[this.rcl].storage[0];
        if (storagePos.x == this.baseSpawn.pos.x)
        {
            if (storagePos.y < this.baseSpawn.pos.y)
            {
                storageLinkPos = new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 4, this.room.name);
            }
            else
            {
                storageLinkPos = new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 8, this.room.name);
            }
        }
        else
        {
            if (storagePos.x < this.baseSpawn.pos.x)
            {
                storageLinkPos = new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y, this.room.name);
            }
            else
            {
                storageLinkPos = new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y, this.room.name);
            }
        }
        const sourceContainers = _.filter(this.room.memory.roomPlan.rcl[this.rcl].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.scheduler.data.roomData[this.room.name].sources, 1).length > 0;
        }) as RoomPosition[];
        this.room.memory.roomPlan.rcl[this.rcl].link = [
            storageLinkPos,
            this.findEmptyInRange(storageLinkPos.findClosestByRange(sourceContainers)!, 1, storageLinkPos)
        ];
    }

    private addExtensions()
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = this.room.memory.roomPlan.rcl[this.rcl].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 4, this.room.name)
        ]);
    }

    private addExtensionRoads()
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 5, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 6, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 7, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 6, this.room.name)
        ]);
    }

    private addTower()
    {
        this.room.memory.roomPlan.rcl[this.rcl].tower = this.room.memory.roomPlan.rcl[this.rcl].tower.concat([
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 3, this.room.name)
        ]);
    }

    private addRamparts()
    {
        for (let y = this.controller.pos.y - 1; y <= this.controller.pos.y + 1; y++)
        {
            for (let x = this.controller.pos.x - 1; x <= this.controller.pos.x + 1; x++)
            {
                if (this.room.lookForAt(LOOK_TERRAIN, x, y).indexOf("wall") === -1)
                {
                    this.room.memory.roomPlan.rcl[this.rcl].rampart.push(new RoomPosition(x, y, this.room.name));
                }
            }
        }
    }
}
