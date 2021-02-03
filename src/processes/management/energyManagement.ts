import { CourierCreepProcess } from "processes/creeps/courier";
import { HarvesterCreepProcess } from "processes/creeps/harvester";
import { MinerCreepProcess } from "processes/creeps/miner";
import { Process } from "processes/process";
import { StorageManagerCreepProcess } from "processes/creeps/storageManager";
import { TransporterCreepProcess } from "processes/creeps/transporter";
import { UpgraderCreepProcess } from "processes/creeps/upgrader";
import { Utils } from "utils/utils";

interface EnergyManagementMetaData
{
    roomName: string
    miningCreeps: { [source: string]: string[] }
    harvestCreeps: { [source: string]: string[] }
    courierCreeps: string[]
    upgradeCreeps: string[]
    storageCreep: string | undefined
    transportCreeps: { [container: string]: string }
}

export class EnergyManagementProcess extends Process
{
    public type = "eman";
    public metaData!: EnergyManagementMetaData;

    public run(): void
    {
        this.initMetaData();

        if (!this.scheduler.data.roomData[this.metaData.roomName])
        {
            this.completed = true;
            return;
        }

        // Harvsters: harvest energy and transfer to structures when no coursiers or transporters.
        const sources = this.scheduler.data.roomData[this.metaData.roomName].sources;
        if (this.harvesters(sources))
        {
            return;
        }

        // Miners: harvest energy at a single source and transfer to a nearby link or drop into container.
        if (this.miners(sources))
        {
            return;
        }

        // Transport creeps: collect energy from source containers and transfer to storage or general containers.
        // Prerequisites: a miner and either storage or a general container must exist.
        const sourceContainers = this.scheduler.data.roomData[this.metaData.roomName].sourceContainers;
        const generalContainers = this.scheduler.data.roomData[this.metaData.roomName].generalContainers;
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

        // Upgraders: collect energy and upgrader controller.
        this.upgraders();
    }

    private harvesters(sources: Source[]): boolean
    {
        _.forEach(sources, (source: Source) =>
        {
            if (!this.metaData.harvestCreeps[source.id])
            {
                this.metaData.harvestCreeps[source.id] = [];
            }
            else if (this.metaData.courierCreeps.length > 0 && Object.keys(this.metaData.transportCreeps).length >= sources.length)
            {
                // Do not spawn harvesters if there is both a courier, and a transporter for each source container.
                return;
            }

            const creepNames = Utils.getLiveCreeps(this.metaData.harvestCreeps[source.id]);
            this.metaData.harvestCreeps[source.id] = creepNames;
            const creeps = Utils.inflateCreeps(creepNames);
            const workRate = Utils.workRate(creeps, 2);

            if (creeps.length < 1 || workRate < source.energyCapacity / 600)
            {
                const creepName = `eman-h-${this.metaData.roomName}-${Game.time}`;
                const spawnRoom = this.metaData.roomName;
                const spawned = Utils.spawn(
                    this.scheduler,
                    spawnRoom,
                    "harvester",
                    creepName
                );

                if (spawned)
                {
                    this.metaData.harvestCreeps[source.id].push(creepName);
                    this.scheduler.addProcessIfNotExist(HarvesterCreepProcess, `hcreep-${creepName}`, 49, {
                        creep: creepName,
                        source: source.id
                    });
                }
            }
        });

        return false;
    }

    private miners(sources: Source[]): boolean
    {
        let ret = false;

        _.forEach(this.scheduler.data.roomData[this.metaData.roomName].sourceContainers, (container: StructureContainer) =>
        {
            if (!this.metaData.miningCreeps[container.id])
            {
                this.metaData.miningCreeps[container.id] = [];
            }

            const creepNames = Utils.getLiveCreeps(this.metaData.miningCreeps[container.id]);
            this.metaData.miningCreeps[container.id] = creepNames;
            const creeps = Utils.inflateCreeps(creepNames);

            if (creeps.length === 0)
            {
                const source = container.pos.findInRange(sources, 1)[0];
                const creepName = `eman-miner-${this.metaData.roomName}-${Game.time}`;
                const spawnRoom = this.metaData.roomName;

                const spawned = Utils.spawn(this.scheduler, spawnRoom, "miner", creepName);

                if (spawned)
                {
                    this.metaData.miningCreeps[container.id].push(creepName);
                    this.scheduler.addProcess(MinerCreepProcess, "mcreep-" + creepName, 49, {
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
    private transporters(sourceContainers: StructureContainer[], generalContainers: StructureContainer[]): boolean
    {
        let ret = false;

        if (Object.keys(this.metaData.miningCreeps).length > 0 &&
            this.room().storage !== undefined || generalContainers.length > 0)
        {
            _.forEach(this.scheduler.data.roomData[this.metaData.roomName].sourceContainers,
                (container: StructureContainer) =>
                {
                    // Delete transporters whose container does not exist.
                    if (!Game.getObjectById(container.id))
                    {
                        delete this.metaData.transportCreeps[container.id];
                        return;
                    }

                    if (!this.metaData.transportCreeps[container.id])
                    {
                        const creepName = `eman-tr-${this.metaData.roomName}-${Game.time}`;
                        const spawned = Utils.spawn(
                            this.scheduler,
                            this.metaData.roomName,
                            "mover",
                            creepName
                        );

                        if (spawned)
                        {
                            this.metaData.transportCreeps[container.id] = creepName;
                            this.scheduler.addProcess(TransporterCreepProcess, "trcreep-" + creepName, 48, {
                                sourceContainer: container.id,
                                creep: creepName,
                                roomName: this.metaData.roomName
                            });
                        }

                        ret = true;
                    }
                    else if (!Game.creeps[this.metaData.transportCreeps[container.id]])
                    {
                        // Delete transporters which do not exist.
                        delete this.metaData.transportCreeps[container.id];
                        return;
                    }
                }
            );
        }

        return ret;
    }

    /**
     * Create miners.
     * @returns Returns whether energy management should return early.
     */
    private couriers(generalContainers: StructureContainer[]): boolean
    {
        let ret = false;

        this.metaData.courierCreeps = Utils.getLiveCreeps(this.metaData.courierCreeps);
        if (this.metaData.courierCreeps.length < 1)
        {
            const storage = this.room().storage;

            const storedEnergy = (storage && storage.store.getUsedCapacity() > 0) ||
                _.filter(generalContainers, (c: StructureContainer) =>
                {
                    return c.store[RESOURCE_ENERGY] > 0;
                })[0];

            if (storedEnergy)
            {
                const creepName = `eman-c-${this.metaData.roomName}-${Game.time}`;
                const spawned = Utils.spawn(
                    this.scheduler,
                    this.metaData.roomName,
                    "mover",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    this.metaData.courierCreeps.push(creepName);
                    this.scheduler.addProcess(CourierCreepProcess, "ccreep-" + creepName, 48, {
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
    private storageManagers(): boolean
    {
        this.metaData.storageCreep = Utils.getLiveCreeps([this.metaData.storageCreep as string])[0];
        if (!this.metaData.storageCreep && this.room().storage)
        {
            const links = this.scheduler.data.roomData[this.room().name].links;
            const storageLink = _.find(links, (l: StructureLink) =>
            {
                const storage = this.room().storage;
                if (!storage)
                {
                    return false;
                }
                return l.pos.inRangeTo(storage, 2);
            });

            if (storageLink)
            {
                const creepName = `eman-sm-${this.metaData.roomName}-${Game.time}`;
                const spawned = Utils.spawn(
                    this.scheduler,
                    this.metaData.roomName,
                    "mover",
                    creepName,
                    {}
                );

                if (spawned)
                {
                    this.metaData.storageCreep = creepName;
                    this.scheduler.addProcess(StorageManagerCreepProcess, "smcreep-" + creepName, 30, {
                        creep: creepName,
                        link: storageLink.id
                    });
                }

                return true;
            }
        }

        return false;
    }

    private upgraders(): void
    {
        this.metaData.upgradeCreeps = Utils.getLiveCreeps(this.metaData.upgradeCreeps);
        if (this.metaData.upgradeCreeps.length < 1 &&
            (this.scheduler.data.roomData[this.metaData.roomName].generalContainers.length > 0 ||
                this.room().storage || this.scheduler.data.roomData[this.metaData.roomName].links.length >= 2))
        {
            const creepName = `eman-u-${this.metaData.roomName}-${Game.time}`;
            const spawned = Utils.spawn(
                this.scheduler,
                this.metaData.roomName,
                "worker",
                creepName
            );

            if (spawned)
            {
                this.metaData.upgradeCreeps.push(creepName);
                this.scheduler.addProcess(UpgraderCreepProcess, "ucreep-" + creepName, 30, {
                    creep: creepName
                });
            }
        }
    }

    private initMetaData(): void
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
}
