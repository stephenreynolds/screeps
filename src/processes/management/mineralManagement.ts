import { Process } from "processes/process";
import { Utils } from "utils/utils";
import { MineralHarvesterCreepProcess } from "processes/creeps/mineralHarvester";

export class MineralManagementProcess extends Process
{
    public type = "minman";

    public run()
    {
        if (this.roomData().mineral && this.roomData().extractor)
        {
            if (this.roomData().mineral!.mineralAmount > 0)
            {
                const creep = Game.creeps[this.metaData.creep];

                if (!creep)
                {
                    const spawned = Utils.spawn(
                        this.scheduler,
                        this.metaData.roomName,
                        "worker",
                        "min-" + this.metaData.roomName + "-" + Game.time
                    );

                    if (spawned)
                    {
                        this.metaData.creep = "min-" + this.metaData.roomName + "-" + Game.time;
                    }
                }
                else
                {
                    this.fork(MineralHarvesterCreepProcess, "mhlf-" + creep.name, 20, {
                        creep: creep.name,
                        extractor: this.roomData().extractor!.id,
                        mineral: this.roomData().mineral!.id
                    });
                }
            }
            else
            {
                this.log("no minerals, completing");
                this.completed = true;
            }
        }
        else
        {
            this.suspend = 200;
        }
    }
}
