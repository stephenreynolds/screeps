import { Utils } from "../../lib/utils";
import { Process } from "../../os/process";

import { HarvesterLifetimeProcess } from "processTypes/lifetimes/harvester";
import { MinerLifetimeProcess } from "processTypes/lifetimes/miner";
import { TransporterLifetimeProcess } from "processTypes/lifetimes/transporter";
import { CourierLifetimeProcess } from "../lifetimes/courier";
import { UpgraderLifetimeProcess } from "../lifetimes/upgrader";

export class EnergyManagementProcess extends Process
{
    public metaData: EnergyManagementMetaData;

    public type = "em";

    public ensureMetaData()
    {
        if (!this.metaData.miningCreeps)
        {
            this.metaData.miningCreeps = {};
        }

        if (!this.metaData.courierCreeps)
        {
            this.metaData.courierCreeps = [];
        }

        if (!this.metaData.harvestCreeps)
        {
            this.metaData.harvestCreeps = {};
        }

        if (!this.metaData.transportCreeps)
        {
            this.metaData.transportCreeps = {};
        }

        if (!this.metaData.upgradeCreeps)
        {
            this.metaData.upgradeCreeps = [];
        }
    }

    public run()
    {
        this.ensureMetaData();

        if (!this.kernel.data.roomData[this.metaData.roomName])
        {
            this.completed = true;
            return;
        }

        if (!this.room().controller!.my)
        {
            this.completed = true;
            return;
        }

        const proc = this;

        const sources = this.kernel.data.roomData[this.metaData.roomName].sources;
        const sourceContainers = this.kernel.data.roomData[proc.metaData.roomName].sourceContainers;

        // Harvester: harvest energy and transfer to structures when no couriers or transporters
        _.forEach(sources, (source) =>
        {
            if (!proc.metaData.harvestCreeps[source.id])
            {
                proc.metaData.harvestCreeps[source.id] = [];
            }

            const creepNames = Utils.clearDeadCreeps(proc.metaData.harvestCreeps[source.id]);
            proc.metaData.harvestCreeps[source.id] = creepNames;
            const creeps = Utils.inflateCreeps(creepNames);
            const workRate = Utils.workRate(creeps, 2);

            if (creeps.length < 1 || workRate < (source.energyCapacity / 300))
            {
                const creepName = `em-h-${proc.metaData.roomName}-${Game.time}`;
                const spawnRoom = proc.metaData.roomName;
                const spawned = Utils.spawn(
                    proc.kernel,
                    spawnRoom,
                    "harvester",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    proc.metaData.harvestCreeps[source.id].push(creepName);
                    proc.kernel.addProcessIfNotExist(HarvesterLifetimeProcess, `hlt-${creepName}`, 49, {
                        creep: creepName,
                        source: source.id
                    });
                }
            }
        });

        // Mining creeps: harvest energy at a single source and transfer to nearby link or drop into container.
        _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, (container) =>
        {
            if (!proc.metaData.miningCreeps[container.id])
            {
                proc.metaData.miningCreeps[container.id] = [];
            }

            const creepNames = Utils.clearDeadCreeps(proc.metaData.miningCreeps[container.id]);
            proc.metaData.miningCreeps[container.id] = creepNames;
            const creeps = Utils.inflateCreeps(creepNames);

            if (creeps.length === 0)
            {
                const source = container.pos.findInRange(sources, 1)[0];
                const creepName = `em-miner-${proc.metaData.roomName}-${Game.time}`;
                const spawnRoom = proc.metaData.roomName;

                const spawned = Utils.spawn(proc.kernel, spawnRoom, "miner", creepName, {});

                if (spawned)
                {
                    proc.metaData.miningCreeps[container.id].push(creepName);
                    proc.kernel.addProcess(MinerLifetimeProcess, "mlf-" + creepName, 49, {
                        creep: creepName,
                        source: source.id,
                        container: container.id
                    });
                }
            }
        });

        /**
         * Transport creeps: collect energy from source containers and transfer to storage or general containers.
         * Prerequisites: a miner and either storage or a general container must exist.
         */
        const generalContainers = this.kernel.data.roomData[this.metaData.roomName].generalContainers;
        if (Object.keys(this.metaData.miningCreeps).length > 0 &&
            this.room().storage !== undefined || generalContainers.length > 0)
        {
            _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, (container) =>
            {
                if (proc.metaData.transportCreeps[container.id])
                {
                    const creep = Game.creeps[proc.metaData.transportCreeps[container.id]];

                    if (!creep)
                    {
                        delete proc.metaData.transportCreeps[container.id];
                        return;
                    }
                }
                else if (Object.keys(this.metaData.transportCreeps).length < sourceContainers.length)
                {
                    const creepName = "em-tr-" + proc.metaData.roomName + "-" + Game.time;
                    const spawned = Utils.spawn(
                        proc.kernel,
                        proc.metaData.roomName,
                        "mover",
                        creepName,
                        {}
                    );

                    if (spawned)
                    {
                        proc.metaData.transportCreeps[container.id] = creepName;
                        proc.kernel.addProcess(TransporterLifetimeProcess, "trlf-" + creepName, 48, {
                            sourceContainer: container.id,
                            creep: creepName,
                            roomName: proc.metaData.roomName
                        });
                    }
                }
            });
        }

        // Courier creeps: collect energy from storage or general containers and transfer to structures.
        this.metaData.courierCreeps = Utils.clearDeadCreeps(this.metaData.courierCreeps);
        if (this.metaData.courierCreeps.length < 2)
        {
            const storedEnergy = (this.room().storage && _.sum(this.room().storage!.store) > 0) ||
                _.filter(generalContainers, (c: Container) =>
                {
                    return c.store[RESOURCE_ENERGY] > 0;
                })[0];

            if (storedEnergy)
            {
                const creepName = "em-c-" + proc.metaData.roomName + "-" + Game.time;
                const spawned = Utils.spawn(
                    proc.kernel,
                    proc.metaData.roomName,
                    "mover",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    proc.metaData.courierCreeps.push(creepName);
                    proc.kernel.addProcess(CourierLifetimeProcess, "clp-" + creepName, 48, {
                        creep: creepName,
                        roomName: proc.metaData.roomName
                    });
                }
            }
        }

        // Upgrade creeps: collect energy and upgrade controller
        this.metaData.upgradeCreeps = Utils.clearDeadCreeps(this.metaData.upgradeCreeps);
        if (this.metaData.upgradeCreeps.length < 2 &&
            (this.kernel.data.roomData[this.metaData.roomName].generalContainers.length > 0 ||
                this.room().storage || this.kernel.data.roomData[this.metaData.roomName].links.length >= 2))
        {
            const creepName = "em-u-" + proc.metaData.roomName + "-" + Game.time;
            const spawned = Utils.spawn(
                proc.kernel,
                proc.metaData.roomName,
                "worker",
                creepName,
                {}
            );

            if (spawned)
            {
                this.metaData.upgradeCreeps.push(creepName);
                this.kernel.addProcess(UpgraderLifetimeProcess, "ulf-" + creepName, 30, {
                    creep: creepName
                });
            }
        }
    }
}
