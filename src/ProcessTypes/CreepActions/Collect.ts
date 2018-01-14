import { Process } from "OS/Process";

import { MoveProcess } from "./Move";

interface CollectProcessMetaData
{
    creep: string;
    target: string;
    resource: ResourceConstant;
}

export class CollectProcess extends Process
{
    public metaData: CollectProcessMetaData;
    public type = "collect";

    public run()
    {
        const creep = Game.creeps[this.metaData.creep];

        if (!creep)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        const target = Game.getObjectById(this.metaData.target) as Structure;

        if (!target)
        {
            this.completed = true;
            this.resumeParent(true);
            return;
        }

        if (!creep.pos.isNearTo(target))
        {
            this.kernel.addProcess(MoveProcess, creep.name + "-collect-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: target.pos.x,
                    y: target.pos.y,
                    roomName: target.pos.roomName
                },
                range: 1
            });
            this.suspend = creep.name + "-collect-move";
        }
        else
        {
            creep.withdraw(target, this.metaData.resource);

            this.completed = true;
            this.resumeParent();
        }
    }
}
