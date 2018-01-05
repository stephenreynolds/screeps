import { Process } from "OS/Process";
import { Utils } from "Utils/Utils";

import { CourierLifetimeProcess } from "../Lifetimes/Courier";
import { HarvesterLifetimeProcess } from "../Lifetimes/Harvester";
import { MinerLifetimeProcess } from "../Lifetimes/Miner";
import { StorageManagerLifetime } from "../Lifetimes/StorageManager";
import { TransporterLifetimeProcess } from "../Lifetimes/Transporter";
import { UpgraderLifetimeProcess } from "../Lifetimes/Upgrader";

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

        if (!this.metaData.storageCreep)
        {
            this.metaData.storageCreep = undefined;
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

        // Harvester: harvest energy and transfer to structures when no couriers or transporters
        const sources = this.kernel.data.roomData[this.metaData.roomName].sources;
        if (this.harvesters(sources))
        {
            return;
        }

        // Mining creeps: harvest energy at a single source and transfer to nearby link or drop into container.
        if (this.miners(sources))
        {
            return;
        }

        // Transport creeps: collect energy from source containers and transfer to storage or general containers.
        // Prerequisites: a miner and either storage or a general container must exist.
        const sourceContainers = this.kernel.data.roomData[this.metaData.roomName].sourceContainers;
        const generalContainers = this.kernel.data.roomData[this.metaData.roomName].generalContainers;
        if (this.transporters(sourceContainers, generalContainers))
        {
            return;
        }

        // Courier creeps: collect energy from storage or general containers and transfer to structures.
        if (this.couriers(generalContainers))
        {
            return;
        }

        // Storage Manager: moves energy from storage link into storage.
        if (this.storageManagers())
        {
            return;
        }

        // Upgrade creeps: collect energy and upgrade controller
        this.upgraders();
    }

    /**
     * Create harvesters.
     * @returns Returns whether energy management should return early.
     */
    private harvesters(sources: Source[])
    {
        let ret = false;

        _.forEach(sources, (source) =>
        {
            if (!this.metaData.harvestCreeps[source.id])
            {
                this.metaData.harvestCreeps[source.id] = [];
            }

            const creepNames = Utils.clearDeadCreeps(this.metaData.harvestCreeps[source.id]);
            this.metaData.harvestCreeps[source.id] = creepNames;
            const creeps = Utils.inflateCreeps(creepNames);
            const workRate = Utils.workRate(creeps, 2);

            if (creeps.length < 1 || workRate < (source.energyCapacity / 600))
            {
                const creepName = `em-h-${this.metaData.roomName}-${Game.time}`;
                const spawnRoom = this.metaData.roomName;
                const spawned = Utils.spawn(
                    this.kernel,
                    spawnRoom,
                    "harvester",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    this.metaData.harvestCreeps[source.id].push(creepName);
                    this.kernel.addProcessIfNotExist(HarvesterLifetimeProcess, `hlt-${creepName}`, 49, {
                        creep: creepName,
                        source: source.id
                    });
                }

                ret = true;
            }
        });

        return ret;
    }

    /**
     * Create miners.
     * @returns Returns whether energy management should return early.
     */
    private miners(sources: Source[])
    {
        let ret = false;

        _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, (container) =>
        {
            if (!this.metaData.miningCreeps[container.id])
            {
                this.metaData.miningCreeps[container.id] = [];
            }

            const creepNames = Utils.clearDeadCreeps(this.metaData.miningCreeps[container.id]);
            this.metaData.miningCreeps[container.id] = creepNames;
            const creeps = Utils.inflateCreeps(creepNames);

            if (creeps.length === 0)
            {
                const source = container.pos.findInRange(sources, 1)[0];
                const creepName = `em-miner-${this.metaData.roomName}-${Game.time}`;
                const spawnRoom = this.metaData.roomName;

                const spawned = Utils.spawn(this.kernel, spawnRoom, "miner", creepName, {});

                if (spawned)
                {
                    this.metaData.miningCreeps[container.id].push(creepName);
                    this.kernel.addProcess(MinerLifetimeProcess, "mlf-" + creepName, 49, {
                        creep: creepName,
                        source: source.id,
                        container: container.id
                    });
                }

                ret = true;
            }
        });

        return ret;
    }

    /**
     * Create transporters.
     * @returns Returns whether energy management should return early.
     */
    private transporters(sourceContainers: StructureContainer[], generalContainers: StructureContainer[])
    {
        let ret = false;

        if (Object.keys(this.metaData.miningCreeps).length > 0 &&
            this.room().storage !== undefined || generalContainers.length > 0)
        {
            _.forEach(this.kernel.data.roomData[this.metaData.roomName].sourceContainers, (container) =>
            {
                if (this.metaData.transportCreeps[container.id])
                {
                    const creep = Game.creeps[this.metaData.transportCreeps[container.id]];

                    if (!creep)
                    {
                        delete this.metaData.transportCreeps[container.id];
                        return;
                    }
                }
                else if (Object.keys(this.metaData.transportCreeps).length < sourceContainers.length)
                {
                    const creepName = "em-tr-" + this.metaData.roomName + "-" + Game.time;
                    const spawned = Utils.spawn(
                        this.kernel,
                        this.metaData.roomName,
                        "mover",
                        creepName,
                        {}
                    );

                    if (spawned)
                    {
                        this.metaData.transportCreeps[container.id] = creepName;
                        this.kernel.addProcess(TransporterLifetimeProcess, "trlf-" + creepName, 48, {
                            sourceContainer: container.id,
                            creep: creepName,
                            roomName: this.metaData.roomName
                        });
                    }

                    ret = true;
                }
            });
        }

        return ret;
    }

    /**
     * Create miners.
     * @returns Returns whether energy management should return early.
     */
    private couriers(generalContainers: StructureContainer[])
    {
        let ret = false;

        this.metaData.courierCreeps = Utils.clearDeadCreeps(this.metaData.courierCreeps);
        if (this.metaData.courierCreeps.length < 1)
        {
            const storedEnergy = (this.room().storage && _.sum(this.room().storage!.store) > 0) ||
                _.filter(generalContainers, (c: StructureContainer) =>
                {
                    return c.store[RESOURCE_ENERGY] > 0;
                })[0];

            if (storedEnergy)
            {
                const creepName = "em-c-" + this.metaData.roomName + "-" + Game.time;
                const spawned = Utils.spawn(
                    this.kernel,
                    this.metaData.roomName,
                    "mover",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    this.metaData.courierCreeps.push(creepName);
                    this.kernel.addProcess(CourierLifetimeProcess, "clp-" + creepName, 48, {
                        creep: creepName,
                        roomName: this.metaData.roomName
                    });
                }

                ret = true;
            }
        }

        return ret;
    }

    /**
     * Create storage managers.
     * @returns Returns whether energy management should return early.
     */
    private storageManagers()
    {
        let ret = false;

        this.metaData.storageCreep = Utils.clearDeadCreeps([this.metaData.storageCreep as string])[0];
        if (!this.metaData.storageCreep && this.room().storage)
        {
            const links = this.kernel.data.roomData[this.room().name].links;
            const storageLink = _.find(links, (l: StructureLink) =>
            {
                return l.pos.inRangeTo(this.room().storage!, 2);
            });

            if (storageLink)
            {
                const creepName = "em-sm-" + this.metaData.roomName + "-" + Game.time;
                const spawned = Utils.spawn(
                    this.kernel,
                    this.metaData.roomName,
                    "mover",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    this.metaData.storageCreep = creepName;
                    this.kernel.addProcess(StorageManagerLifetime, "smlf-" + creepName, 30, {
                        creep: creepName,
                        link: storageLink.id
                    });
                }

                ret = true;
            }
        }

        return ret;
    }

    /**
     * Create upgraders.
     */
    private upgraders()
    {
        this.metaData.upgradeCreeps = Utils.clearDeadCreeps(this.metaData.upgradeCreeps);
        if (this.metaData.upgradeCreeps.length < 2 &&
            (this.kernel.data.roomData[this.metaData.roomName].generalContainers.length > 0 ||
                this.room().storage || this.kernel.data.roomData[this.metaData.roomName].links.length >= 2))
        {
            const creepName = "em-u-" + this.metaData.roomName + "-" + Game.time;
            const spawned = Utils.spawn(
                this.kernel,
                this.metaData.roomName,
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
