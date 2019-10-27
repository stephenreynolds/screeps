import { RCLPlan } from "./rclPlan";

export class RCL2 extends RCLPlan
{
    protected rcl: number = 2;

    public generate()
    {
        this.init();

        const baseToController = PathFinder.search(
            this.baseSpawn.pos, { pos: this.controller.pos, range: 3 }).path;

        this.addControllerRoads(baseToController);
        const generalContainerPos = this.addGeneralContainer(baseToController);
        this.addSourceContainer(generalContainerPos);
        this.addBaseRoads();
        this.addExtensions();
        this.addExtensionRoads();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};

        // Copy RCL 1
        this.room.memory.roomPlan.rcl[this.rcl].spawn = _.clone(this.room.memory.roomPlan.rcl[this.rcl - 1].spawn);

        // Initialize arrays
        this.room.memory.roomPlan.rcl[this.rcl].road = [];
        this.room.memory.roomPlan.rcl[this.rcl].container = [];
    }

    private addControllerRoads(baseToController: RoomPosition[])
    {
        for (const pos of baseToController)
        {
            this.room.memory.roomPlan.rcl[this.rcl].road.push(pos);
        }
    }

    private addGeneralContainer(baseToController: RoomPosition[]): RoomPosition
    {
        const generalContainerPos = baseToController[Math.floor(baseToController.length / 2)];
        this.room.memory.roomPlan.rcl[this.rcl].container.push(generalContainerPos);

        return generalContainerPos;
    }

    private addSourceContainer(generalContainerPos: RoomPosition)
    {
        const sources = this.scheduler.data.roomData[this.room.name].sources;
        for (let i = 0; i < sources.length; ++i)
        {
            let containerPos: RoomPosition;
            const nearContainers = sources[i].pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (s: Structure) =>
                {
                    return s.structureType === STRUCTURE_CONTAINER;
                }
            });
            if (nearContainers.length > 0)
            {
                containerPos = nearContainers[0].pos;
            }
            else
            {
                const nearContainerSites = sources[i].pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                    filter: (s: ConstructionSite) =>
                    {
                        return s.structureType === STRUCTURE_CONTAINER;
                    }
                });
                if (nearContainerSites.length > 0)
                {
                    containerPos = nearContainerSites[0].pos;
                }
                else
                {
                    containerPos = this.findEmptyInRange(sources[i].pos, 1, this.baseSpawn.pos, ["wall"])!;
                }
            }
            this.room.memory.roomPlan.rcl[this.rcl].container.push(containerPos);

            // Source roads
            let path = PathFinder.search(this.baseSpawn.pos, { pos: sources[i].pos, range: 1 }).path;
            for (let j = 0; j < path.length; ++j)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(path[j]);
            }

            // Source to controller
            path = PathFinder.search(sources[i].pos, { pos: this.controller.pos, range: 3 }).path;
            for (let j = 0; j < path.length; ++j)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(path[j]);
            }

            // Source to general container
            path = PathFinder.search(sources[i].pos, { pos: generalContainerPos, range: 1 }).path;
            for (let j = 0; j < path.length; ++j)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(path[j]);
            }
        }
    }

    private addBaseRoads()
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            // Top to right
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 3, this.baseSpawn.pos.y + 2, this.room.name),
            // Right to bottom
            new RoomPosition(this.baseSpawn.pos.x + 2, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x + 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x, this.baseSpawn.pos.y + 5, this.room.name),
            // Bottom to left
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y + 4, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y + 2, this.room.name),
            // Left to top
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y + 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y, this.room.name)
        ]);
    }

    private addExtensions()
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 1, this.room.name)
        ];
    }

    private addExtensionRoads()
    {
        this.room.memory.roomPlan.rcl[this.rcl].road = this.room.memory.roomPlan.rcl[this.rcl].road.concat([
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 3, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 5, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 4, this.baseSpawn.pos.y + 1, this.room.name)
        ]);
    }
}
