import { Process } from "os/process";

import { MoveProcess } from "./move";

interface BuildProcessMetaData extends CreepMetaData
{
    site: string;
}

export class BuildProcess extends Process
{
    public metaData!: BuildProcessMetaData;
    public type = "build";

    public run()
    {
        const creep = Game.creeps[this.metaData.creep];
        const site = Game.getObjectById(this.metaData.site) as ConstructionSite;

        if (creep && !site)
        {
            Memory.rooms[creep.room.name] = {};
        }

        if (!site || !creep || _.sum(creep.carry) === 0)
        {
            this.completed = true;
            this.resumeParent();
            return;
        }

        if (!creep.pos.inRangeTo(site, 3))
        {
            this.scheduler.addProcess(MoveProcess, creep.name + "-build-move", this.priority + 1, {
                creep: creep.name,
                pos: {
                    x: site.pos.x,
                    y: site.pos.y,
                    roomName: site.pos.roomName
                },
                range: 3
            });
            this.suspend = creep.name + "-build-move";
        }
        else
        {
            creep.build(site);
        }
    }
}
