import { MoveProcess } from "./move";
import { Process } from "processes/process";

interface SignProcessMetaData extends CreepMetaData
{
    text: string;
}

export class SignProcess extends Process
{
    public type = "sign";
    public metaData!: SignProcessMetaData;

    public run(): void
    {
        const creep = Game.creeps[this.metaData.creep];

        if (!(creep && creep.room.controller))
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        const controller = creep.room.controller;

        if (!creep.pos.isNearTo(controller.pos))
        {
            this.scheduler.addProcess(MoveProcess, creep.name + "-sign-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: controller.pos.x,
                    y: controller.pos.y,
                    roomName: creep.room.name
                },
                range: 1
            });
            this.suspend = creep.name + "-sign-move";
        }
        else
        {
            creep.signController(controller, this.metaData.text);
            this.completed = true;
        }
    }
}
