import { Process } from "processes/process";
import { Utils } from "utils/utils";
import { RangerCreepProcess } from "processes/creeps/ranger";
import { BrawlerCreepProcess } from "processes/creeps/brawler";

export class InvasionManagementProcess extends Process
{
    public type = "invman";

    public ensureMetaData()
    {
        if (!this.metaData.brawlers)
        {
            this.metaData.brawlers = [];
        }

        if (!this.metaData.rangers)
        {
            this.metaData.rangers = [];
        }

        if (!this.metaData.healers)
        {
            this.metaData.healers = [];
        }
    }

    public run()
    {
        const flag = Game.flags[this.metaData.flag];

        if (!flag)
        {
            this.completed = true;
            return;
        }

        this.ensureMetaData();

        const nearestRoom = Utils.nearestRoom(flag.pos.roomName, 600);
        let ret = false;

        if (!nearestRoom)
        {
            this.suspend = 10;
            return;
        }

        // Brawlers
        let creepNames = Utils.getLiveCreeps(this.metaData.brawlers);
        this.metaData.brawlers = creepNames;
        let creep = Utils.inflateCreeps(creepNames);

        if (creep.length < 5)
        {
            const creepName = `inv-brawler-${flag.pos.roomName}-${Game.time}`;
            const spawned = Utils.spawn(this.scheduler, nearestRoom, "brawler", creepName, {});

            if (spawned)
            {
                this.metaData.brawlers.push(creepName);
                this.scheduler.addProcess(BrawlerCreepProcess, `bcreep-${creepName}`, 49, {
                    creep: creepName,
                    flag: flag
                });
            }

            ret = true;
        }

        if (ret)
        {
            return;
        }

        // Rangers
        creepNames = Utils.getLiveCreeps(this.metaData.rangers);
        this.metaData.rangers = creepNames;
        creep = Utils.inflateCreeps(creepNames);

        if (creep.length < 5)
        {
            const creepName = `inv-ranger-${this.metaData.roomName}-${Game.time}`;
            const spawned = Utils.spawn(this.scheduler, nearestRoom, "ranger", creepName, {});

            if (spawned)
            {
                this.metaData.rangers.push(creepName);
                this.scheduler.addProcess(RangerCreepProcess, `racreep-${creepName}`, 49, {
                    creep: creepName,
                    flag: flag
                });
            }

            ret = true;
        }

        if (ret)
        {
            return;
        }
    }
}
