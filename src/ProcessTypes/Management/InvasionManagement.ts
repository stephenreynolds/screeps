import { Utils } from "lib/Utils";
import { Process } from "OS/Process";
import { RangerLifetimeProcess } from "ProcessTypes/Lifetimes/Ranger";
import { BrawlerLifetimeProcess } from "../Lifetimes/Brawler";

export class InvasionManagementProcess extends Process
{
    public type = "inv";

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
        let creepNames = Utils.clearDeadCreeps(this.metaData.brawlers);
        this.metaData.brawlers = creepNames;
        let creep = Utils.inflateCreeps(creepNames);

        if (creep.length < 5)
        {
            const creepName = `inv-brawler-${flag.pos.roomName}-${Game.time}`;
            const spawned = Utils.spawn(this.kernel, nearestRoom, "brawler", creepName, {});

            if (spawned)
            {
                this.metaData.brawlers.push(creepName);
                this.kernel.addProcess(BrawlerLifetimeProcess, `brawlerLifetime-${creepName}`, 49, {
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
        creepNames = Utils.clearDeadCreeps(this.metaData.rangers);
        this.metaData.rangers = creepNames;
        creep = Utils.inflateCreeps(creepNames);

        if (creep.length < 5)
        {
            const creepName = `inv-ranger-${this.metaData.roomName}-${Game.time}`;
            const spawned = Utils.spawn(this.kernel, nearestRoom, "ranger", creepName, {});

            if (spawned)
            {
                this.metaData.rangers.push(creepName);
                this.kernel.addProcess(RangerLifetimeProcess, `rangerLifetime-${creepName}`, 49, {
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
