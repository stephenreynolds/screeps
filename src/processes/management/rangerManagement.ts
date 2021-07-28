import { Process } from "processes/process";
import { Utils } from "utils/utils";
import { RangerCreepProcess } from "processes/creeps/ranger";

export class RangerManagementProcess extends Process
{
    public type = "raman";

    public run()
    {
        this.metaData.rangers = Utils.getLiveCreeps(this.metaData.rangers);

        if (!this.flag())
        {
            this.completed = true;
            return;
        }

        const count = this.metaData.rangers.length;
        const counted = _.filter(this.metaData.rangers, (creepName: string) =>
        {
            const creep = Game.creeps[creepName];

            return (creep.ticksToLive! > 300);
        }).length;

        if (_.min([count, counted]) < this.metaData.count)
        {
            const creepName = "racreep-" + Game.time;

            const spawned = Utils.spawn(
                this.scheduler,
                Utils.nearestRoom(this.flag().pos.roomName, 1300),
                "ranger",
                creepName,
                {}
            );

            if (spawned)
            {
                this.metaData.rangers.push(creepName);
                this.scheduler.addProcess(RangerCreepProcess, creepName, this.priority - 1, {
                    creep: creepName,
                    flag: this.metaData.flag
                });
            }
        }
    }
}
