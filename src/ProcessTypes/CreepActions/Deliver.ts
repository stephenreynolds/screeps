import { Process } from "../../OS/Process";
import { MoveProcess } from "./Move";

export class DeliverProcess extends Process
{
    public metaData: DeliverProcessMetaData;
    public type = "deliver";

    public run()
    {
        const creep = Game.creeps[this.metaData.creep];
        const target = Game.getObjectById(this.metaData.target) as Structure;

        if (!target || !creep || _.sum(creep.carry) === 0)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        if (!creep.pos.inRangeTo(target, 1))
        {
            this.kernel.addProcess(MoveProcess, creep.name + "-deliver-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: target.pos.x,
                    y: target.pos.y,
                    roomName: target.pos.roomName
                },
                range: 1
            });
            this.suspend = creep.name + "-deliver-move";
        }
        else
        {
            if (creep.transfer(target, (this.metaData.resource || RESOURCE_ENERGY)) === ERR_FULL)
            {
                this.completed = true;
                this.resumeParent();
            }
        }
    }
}
