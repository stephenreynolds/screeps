import { Process } from "processes/process";
import { MoveProcess } from "./move";

interface DeliverProcessMetaData extends CreepMetaData
{
    target: string
    resource: _ResourceConstantSansEnergy
}

export class DeliverProcess extends Process
{
    public metaData!: DeliverProcessMetaData;
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

        const transferResult = creep.transfer(target, (this.metaData.resource || RESOURCE_ENERGY));

        switch (transferResult)
        {
            case ERR_NOT_IN_RANGE:
                this.scheduler.addProcess(MoveProcess, creep.name + "-deliver-move", this.priority + 1, {
                    creep: creep.name,
                    pos: {
                        x: target.pos.x,
                        y: target.pos.y,
                        roomName: target.pos.roomName
                    },
                    range: 1
                });
                this.suspend = creep.name + "-deliver-move";
                break;
            case ERR_FULL:
            case ERR_INVALID_TARGET:
                this.completed = true;
                this.resumeParent();
                break;
        }
    }
}
