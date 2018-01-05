import { Process } from "OS/Process";

import { MoveProcess } from "./Move";

interface UpgradeProcessMetaData
{
    creep: string;
}

export class UpgradeProcess extends Process
{
    public metaData: UpgradeProcessMetaData;
    public type = "upgrade";

    public run()
    {
        const creep = Game.creeps[this.metaData.creep];

        if (!creep || _.sum(creep.carry) === 0)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        if (!creep.pos.inRangeTo(creep.room.controller!, 3))
        {
            this.kernel.addProcess(MoveProcess, creep.name + "-upgrade-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: creep.room.controller!.pos.x,
                    y: creep.room.controller!.pos.y,
                    roomName: creep.room.name
                },
                range: 3
            });
            this.suspend = creep.name + "-upgrade-move";
        }
        else
        {
            creep.upgradeController(creep.room.controller!);
        }
    }
}
