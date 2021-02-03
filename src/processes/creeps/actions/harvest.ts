import { MoveProcess } from "./move";
import { Process } from "processes/process";

interface HarvestMetaData extends CreepMetaData
{
    source: string;
}

export class HarvestProcess extends Process
{
    public metaData!: HarvestMetaData;
    public type = "harvest";

    public run(): void
    {
        const creep = Game.creeps[this.metaData.creep];

        const source = Game.getObjectById(this.metaData.source) as Source;

        if (!creep || creep.store.getFreeCapacity() === 0 || !source)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        if (!creep.pos.inRangeTo(source.pos, 1))
        {
            this.scheduler.addProcess(MoveProcess, creep.name + "-harvest-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: source.pos.x,
                    y: source.pos.y,
                    roomName: source.pos.roomName
                },
                range: 1
            });
            this.suspend = creep.name + "-harvest-move";
        }
        else
        {
            if (creep.harvest(source) === ERR_NOT_ENOUGH_RESOURCES)
            {
                this.suspend = source.ticksToRegeneration;
            }
        }
    }
}
