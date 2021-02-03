import { RCLPlan } from "./rclPlan";

export class RCL2 extends RCLPlan
{
    protected rcl = 2;

    public generate(): void
    {
        this.init();

        const baseToController = PathFinder.search(
            this.baseSpawn.pos, { pos: this.controller.pos, range: 3 }).path;

        const generalContainerPos = this.addGeneralContainer(baseToController);
        this.addSourceContainer(generalContainerPos);
        this.addControllerRoads(baseToController);
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

    private addControllerRoads(baseToController: RoomPosition[]): void
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

    private addSourceContainer(generalContainerPos: RoomPosition): void
    {
        const sources = this.scheduler.data.roomData[this.room.name].sources;
        for (const source of sources)
        {
            let containerPos: RoomPosition;
            const nearContainers = source.pos.findInRange(FIND_STRUCTURES, 1, {
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
                const nearContainerSites = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
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
                    const emptyPos = this.findEmptyInRange(source.pos, 1, this.baseSpawn.pos, ["wall"]);
                    if (!emptyPos)
                    {
                        console.log("Could not find an empty position near source for container.");
                        return;
                    }
                    containerPos = emptyPos;
                }
            }
            this.room.memory.roomPlan.rcl[this.rcl].container.push(containerPos);

            // Source roads
            let path = PathFinder.search(this.baseSpawn.pos, { pos: source.pos, range: 1 }).path;
            for (const p of path)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(p);
            }

            // Source to controller
            path = PathFinder.search(source.pos, { pos: this.controller.pos, range: 3 }).path;
            for (const p of path)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(p);
            }

            // Source to general container
            path = PathFinder.search(source.pos, { pos: generalContainerPos, range: 1 }).path;
            for (const p of path)
            {
                this.room.memory.roomPlan.rcl[this.rcl].road.push(p);
            }
        }
    }

    private addBaseRoads(): void
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

    private addExtensions(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].extension = [
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y - 2, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 1, this.baseSpawn.pos.y - 1, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 2, this.baseSpawn.pos.y, this.room.name),
            new RoomPosition(this.baseSpawn.pos.x - 3, this.baseSpawn.pos.y - 1, this.room.name)
        ];
    }

    private addExtensionRoads(): void
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
