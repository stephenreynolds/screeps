import { Process } from "processes/process";
import { RemoteMinerCreepProcess } from "processes/creeps/remoteMiner";
import { Utils } from "utils/utils";

export class RemoteMiningManagementProcess extends Process
{
    public type = "rmman";

    public run(): void
    {
        const flag = Game.flags[this.metaData.flag];

        if (!flag)
        {
            this.completed = true;
            return;
        }

        const deliverRoom = flag.name.split("-")[0];

        if (Game.rooms[deliverRoom].energyAvailable < 600)
        {
            return;
        }

        const miningCreep = Game.creeps[this.metaData.miningCreep];

        if (!miningCreep)
        {
            const spawned = Utils.spawn(
                this.scheduler,
                deliverRoom,
                "worker",
                `rm-${flag.pos.roomName}-${Game.time}`
            );

            if (spawned)
            {
                this.metaData.miningCreep = `rm-${flag.pos.roomName}-${Game.time}`;
            }
        }
        else
        {
            this.scheduler.addProcessIfNotExist(RemoteMinerCreepProcess, "rmcreep-" + miningCreep.name, this.priority, {
                creep: miningCreep.name,
                flag: flag.name,
                deliverRoom
            });
        }
    }
}
