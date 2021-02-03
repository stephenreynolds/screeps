import { MoveProcess } from "./move";
import { Process } from "processes/process";

type UpgradeProcessMetaData = CreepMetaData

export class UpgradeProcess extends Process
{
    public metaData!: UpgradeProcessMetaData;
    public type = "upgrade";

    public run(): void
    {
        const creep = Game.creeps[this.metaData.creep];

        if (!creep || creep.store.getUsedCapacity() === 0 || !creep.room.controller)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        const controller = creep.room.controller;

        if (!creep.pos.inRangeTo(controller, 3))
        {
            this.scheduler.addProcess(MoveProcess, creep.name + "-upgrade-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: controller.pos.x,
                    y: controller.pos.y,
                    roomName: creep.room.name
                },
                range: 3
            });
            this.suspend = creep.name + "-upgrade-move";
        }
        else
        {
            creep.upgradeController(controller);
        }
    }
}
