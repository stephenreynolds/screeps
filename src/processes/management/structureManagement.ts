import { Process } from "processes/process";
import { Utils } from "utils/utils";
import { BuilderCreepProcess } from "processes/creeps/builder";
import { RepairerCreepProcess } from "processes/creeps/repairer";

interface StructureManagementProcessMetaData
{
    roomName: string;
    spareCreeps: string[];
    buildCreeps: string[];
    repairCreeps: string[];
}

export class StructureManagementProcess extends Process
{
    public metaData!: StructureManagementProcessMetaData;
    public type = "sman";

    public ensureMetaData()
    {
        if (!this.metaData.spareCreeps)
        {
            this.metaData.spareCreeps = [];
        }

        if (!this.metaData.buildCreeps)
        {
            this.metaData.buildCreeps = [];
        }

        if (!this.metaData.repairCreeps)
        {
            this.metaData.repairCreeps = [];
        }
    }

    public run()
    {
        this.ensureMetaData();

        if (!this.scheduler.data.roomData[this.metaData.roomName])
        {
            this.completed = true;
            return;
        }

        if (this.room().energyAvailable < 300 ||
            this.scheduler.data.roomData[this.metaData.roomName].containers.length === 0)
        {
            return;
        }

        const numBuilders = _.min([
            3,
            this.scheduler.data.roomData[this.metaData.roomName].constructionSites.length,
            this.room().controller!.level - 1
        ]);

        this.metaData.buildCreeps = Utils.getLiveCreeps(this.metaData.buildCreeps);
        this.metaData.repairCreeps = Utils.getLiveCreeps(this.metaData.repairCreeps);
        this.metaData.spareCreeps = Utils.getLiveCreeps(this.metaData.spareCreeps);

        if (this.metaData.buildCreeps.length < numBuilders)
        {
            if (this.metaData.spareCreeps.length === 0)
            {
                const creepName = "sman-b-" + this.metaData.roomName + "-" + Game.time;
                const spawned = Utils.spawn(this.scheduler, this.metaData.roomName, "worker", creepName, {});
                if (spawned)
                {
                    this.metaData.buildCreeps.push(creepName);
                    this.scheduler.addProcess(BuilderCreepProcess, "bcreep-" + creepName, 30, {
                        creep: creepName
                    });
                }
            }
            else
            {
                const creepName = this.metaData.spareCreeps.pop() as string;
                this.metaData.buildCreeps.push(creepName);
                this.scheduler.addProcess(BuilderCreepProcess, "bcreep-" + creepName, 30, {
                    creep: creepName
                });
            }
        }

        if (this.roomData().walls.length > 0 || this.roomData().towers.length === 0)
        {
            const repairableObjects = [].concat(
                this.scheduler.data.roomData[this.metaData.roomName].containers as never[],
                this.scheduler.data.roomData[this.metaData.roomName].roads as never[]
            ) as Structure[];

            const repairTargets = _.filter(repairableObjects, (object: Structure) =>
            {
                return object.hits < object.hitsMax;
            });

            if (repairTargets.length > 0)
            {
                if (this.metaData.repairCreeps.length === 0)
                {
                    if (this.metaData.spareCreeps.length === 0)
                    {
                        const creepName = "sman-r-" + this.metaData.roomName + "-" + Game.time;
                        const spawned = Utils.spawn(this.scheduler, this.metaData.roomName, "worker", creepName, {});
                        if (spawned)
                        {
                            this.metaData.repairCreeps.push(creepName);
                            this.scheduler.addProcess(RepairerCreepProcess, "rcreep-" + creepName, 29, {
                                creep: creepName,
                                roomName: this.metaData.roomName
                            });
                        }
                    }
                    else
                    {
                        const creepName = this.metaData.spareCreeps.pop() as string;
                        this.metaData.repairCreeps.push(creepName);
                        this.scheduler.addProcess(RepairerCreepProcess, "rcreep-" + creepName, 29, {
                            creep: creepName,
                            roomName: this.metaData.roomName
                        });
                    }
                }
            }
        }
    }
}
