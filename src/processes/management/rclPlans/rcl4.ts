import { RCLPlan } from "./rclPlan";

export class RCL4 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[4] = {};

        // Copy RCL 3
        this.room.memory.roomPlan.rcl[4].spawn = _.clone(this.room.memory.roomPlan.rcl[3].spawn);
        this.room.memory.roomPlan.rcl[4].road = _.clone(this.room.memory.roomPlan.rcl[3].road);
        this.room.memory.roomPlan.rcl[4].container = _.clone(this.room.memory.roomPlan.rcl[3].container);
        this.room.memory.roomPlan.rcl[4].extension = _.clone(this.room.memory.roomPlan.rcl[3].extension);
        this.room.memory.roomPlan.rcl[4].tower = _.clone(this.room.memory.roomPlan.rcl[3].tower);
        this.room.memory.roomPlan.rcl[4].constructedWall = _.clone(this.room.memory.roomPlan.rcl[3].constructedWall);
        this.room.memory.roomPlan.rcl[4].rampart = _.clone(this.room.memory.roomPlan.rcl[3].rampart);

        // Storage
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
        nearestRange = 99;
        let nearest: RoomPosition;

        let y = -6;
        for (let x = -8; x <= 8; x++)
        {
            const pos = new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + y, this.room.name);
            const range = pos.getRangeTo(nearestSource!.pos);
            if (range < nearestRange && this.isBuildablePos(pos.x, pos.y))
            {
                nearestRange = range;
                nearest = pos;
            }
        }

        y = 10;
        for (let x = -8; x <= 8; x++)
        {
            const pos = new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + y, this.room.name);
            const range = pos.getRangeTo(nearestSource!.pos);
            if (range < nearestRange && this.isBuildablePos(pos.x, pos.y))
            {
                nearestRange = range;
                nearest = pos;
            }
        }

        let x = -8;
        for (let y = -6; y <= 10; y++)
        {
            const pos = new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + y, this.room.name);
            const range = pos.getRangeTo(nearestSource!.pos);
            if (range < nearestRange && this.isBuildablePos(pos.x, pos.y))
            {
                nearestRange = range;
                nearest = pos;
            }
        }

        x = 8;
        for (let y = -6; y <= 10; y++)
        {
            const pos = new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + y, this.room.name);
            const range = pos.getRangeTo(nearestSource!.pos);
            if (range < nearestRange && this.isBuildablePos(pos.x, pos.y))
            {
                nearestRange = range;
                nearest = pos;
            }
        }

        this.room.memory.roomPlan.rcl[4].storage = [nearest!];

        // Extensions
        this.room.memory.roomPlan.rcl[4].extension = this.room.memory.roomPlan.rcl[4].extension.concat([
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

        // Extension roads
        this.room.memory.roomPlan.rcl[4].road = this.room.memory.roomPlan.rcl[4].road.concat([
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

        // Ramparts
        for (let x = -5; x <= 5; x++)
        {
            // Top
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y - 4, this.room.name));
        }
        for (let y = -3; y <= 7; y++)
        {
            // Right
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + 6, this.baseSpawn.pos.y + y, this.room.name));
        }
        for (let x = 5; x >= -5; x--)
        {
            // Bottom
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x + x, this.baseSpawn.pos.y + 8, this.room.name));
        }
        for (let y = 7; y >= -3; y--)
        {
            // Left
            this.room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(this.baseSpawn.pos.x - 6, this.baseSpawn.pos.y + y, this.room.name));
        }
        // Corners
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y - 3, this.room.name));
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y - 3, this.room.name));
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x + 5, this.baseSpawn.pos.y + 7, this.room.name));
        this.room.memory.roomPlan.rcl[4].rampart.push(
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y + 7, this.room.name));

        this.finished(4);
    }
}
