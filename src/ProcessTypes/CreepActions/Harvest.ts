import { Process } from "OS/Process";

import { MoveProcess } from "./Move";

interface HarvestMetaData
{
    source: string;
    creep: string;
}

export class HarvestProcess extends Process
{
    public metaData: HarvestMetaData;
    public type = "harvest";

    public run()
    {
        const creep = Game.creeps[this.metaData.creep];

        if (!creep || _.sum(creep.carry) === creep.carryCapacity)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        const source = Game.getObjectById(this.metaData.source) as Source;

        if (!creep.pos.inRangeTo(source.pos, 1))
        {
            this.kernel.addProcess(MoveProcess, creep.name + "-harvest-move", this.priority + 1, {
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
