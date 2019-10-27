import { RCLPlan } from "./rclPlan";

export class RCL4 extends RCLPlan
{
    protected rcl: number = 4;

    public generate()
    {
        this.init();

        this.addStorage();
        this.addExtensions();
        this.addExtensionRoads();
        this.addRamparts();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL 3
        this.room.memory.roomPlan.rcl[this.rcl].spawn = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].spawn);
        this.room.memory.roomPlan.rcl[this.rcl].road = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].road);
        this.room.memory.roomPlan.rcl[this.rcl].container = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].container);
        this.room.memory.roomPlan.rcl[this.rcl].extension = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].extension);
        this.room.memory.roomPlan.rcl[this.rcl].tower = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].tower);
        this.room.memory.roomPlan.rcl[this.rcl].constructedWall = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].constructedWall);
        this.room.memory.roomPlan.rcl[this.rcl].rampart = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].rampart);
    }

    private addStorage()
    {
        // Find source nearest to the controller.
        let nearestSource: Source;
        let nearestRange: number = 99;
        for (const source of this.scheduler.data.roomData[this.room.name].sources)
        {
            const range = source.pos.getRangeTo(this.room.controller!.pos);
            if (range < nearestRange)
            {
                nearestSource = source;
            }
        }
        // Find storage pos nearest to nearest source.
        // Top
        let nearest = new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 6, this.room.name);
        nearestRange = nearest.getRangeTo(nearestSource!.pos);
        // Bottom
        let newPos = new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 10, this.room.name);
        let newRange = newPos.getRangeTo(nearestSource!.pos);
        if (newRange < nearestRange)
        {
            nearestRange = newRange;
            nearest = newPos;
        }
        // Left
        newPos = new RoomPosition(this.baseSpawn.pos.x - 8, this.baseSpawn.pos.y + 2, this.room.name);
        newRange = newPos.getRangeTo(nearestSource!.pos);
        if (newRange < nearestRange)
        {
            nearestRange = newRange;
            nearest = newPos;
        }
        // Right
        newPos = new RoomPosition(this.baseSpawn.pos.x + 8, this.baseSpawn.pos.y + 2, this.room.name);
        newRange = newPos.getRangeTo(nearestSource!.pos);
        if (newRange < nearestRange)
        {
            nearestRange = newRange;
            nearest = newPos;
        }

        this.room.memory.roomPlan.rcl[this.rcl].storage = [nearest!];
    }

    private addExtensions()
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = this.room.memory.roomPlan.rcl[this.rcl].extension.concat([
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 3, this.room.name)
        ]);
    }

    private addExtensionRoads()
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 4, this.room.name)
        ]);
    }

    private addRamparts()
    {
        for (let x = -5; x <= 5; x++)
        {
            // Top
            this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y - 4, this.room.name));
        }
        for (let y = -3; y <= 7; y++)
        {
            // Right
            this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + y, this.room.name));
        }
        for (let x = 5; x >= -5; x--)
        {
            // Bottom
            this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + 8, this.room.name));
        }
        for (let y = 7; y >= -3; y--)
        {
            // Left
            this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + y, this.room.name));
        }
        // Corners
        this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 3, this.room.name));
        this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 3, this.room.name));
        this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 7, this.room.name));
        this.room.memory.roomPlan.rcl[this.rcl].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 7, this.room.name));
    }
}
