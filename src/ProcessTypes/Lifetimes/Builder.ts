import { LifetimeProcess } from "OS/LifetimeProcess";
import { Utils } from "Utils/Utils";

import { BuildProcess } from "../CreepActions/Build";
import { CollectProcess } from "../CreepActions/Collect";
import { DeliverProcess } from "../CreepActions/Deliver";
import { RepairProcess } from "../CreepActions/Repair";

export class BuilderLifetimeProcess extends LifetimeProcess
{
    public type = "blf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        if (_.sum(creep.carry) === 0)
        {
            this.collect(creep);
        }

        // If the creep has been refilled
        const sites = this.kernel.data.roomData[creep.room.name].constructionSites;
        const buildNow = this.buildNow(sites);
        const target = creep.pos.findClosestByRange(buildNow);

        if (target)
        {
            this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
                creep: creep.name,
                site: target.id
            });
        }
        else
        {
            const repairTarget = creep.pos.findClosestByRange(
                _.filter(this.kernel.data.roomData[creep.room.name].myStructures, (s: Structure) =>
                {
                    if (s.structureType === STRUCTURE_RAMPART)
                    {
                        return s.hits < Utils.rampartHealth(this.kernel, creep.room.name);
                    }
                    else
                    {
                        return s.hits < s.hitsMax;
                    }
                }));

            if (repairTarget)
            {
                this.fork(RepairProcess, "repair-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    target: repairTarget.id
                });
            }
            else
            {
                this.deliver(creep);
            }
        }
    }

    private collect(creep: Creep)
    {
        const withdrawTarget = Utils.withdrawTarget(creep, this);

        if (withdrawTarget)
        {
            this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                creep: creep.name,
                target: withdrawTarget.id,
                resource: RESOURCE_ENERGY
            });

            return;
        }
        else
        {
            this.suspend = 10;
            return;
        }
    }

    private buildNow(sites: ConstructionSite[])
    {
        const towerSites = _.filter(sites, (site) =>
        {
            return (site.structureType === STRUCTURE_TOWER);
        });

        const extensionSites = _.filter(sites, (site) =>
        {
            return (site.structureType === STRUCTURE_EXTENSION);
        });

        const containerSites = _.filter(sites, (site) =>
        {
            return (site.structureType === STRUCTURE_CONTAINER);
        });

        const rampartSites = _.filter(sites, (site) =>
        {
            return (site.structureType === STRUCTURE_RAMPART);
        });

        const normalSites = _.filter(sites, (site) =>
        {
            return !(
                site.structureType === STRUCTURE_TOWER
                ||
                site.structureType === STRUCTURE_EXTENSION
                ||
                site.structureType === STRUCTURE_RAMPART
                ||
                site.structureType === STRUCTURE_CONTAINER
            );
        });

        let buildNow: ConstructionSite[];

        if (towerSites.length > 0)
        {
            buildNow = towerSites;
        }
        else
        {
            if (extensionSites.length > 0)
            {
                buildNow = extensionSites;
            }
            else
            {
                if (containerSites.length > 0)
                {
                    buildNow = containerSites;
                }
                else
                {
                    if (rampartSites.length > 0)
                    {
                        buildNow = rampartSites;
                    }
                    else
                    {
                        buildNow = normalSites;
                    }
                }
            }
        }

        return buildNow;
    }

    private deliver(creep: Creep)
    {
        let deliverTargets;

        const targets = [].concat(
            this.kernel.data.roomData[creep.room.name].spawns as never[],
            this.kernel.data.roomData[creep.room.name].extensions as never[]
        );

        deliverTargets = _.filter(targets, (t: DeliveryTarget) =>
        {
            return (t.energy < t.energyCapacity);
        });

        if (deliverTargets.length === 0)
        {
            const targs = [].concat(
                this.kernel.data.roomData[creep.room.name].towers as never[]
            );

            deliverTargets = _.filter(targs, (t: DeliveryTarget) =>
            {
                return t.energy < t.energyCapacity;
            });
        }

        if (creep.room.storage && deliverTargets.length === 0)
        {
            const targs = [].concat(
                [creep.room.storage] as never[]
            );

            deliverTargets = _.filter(targs, (t: DeliveryTarget) =>
            {
                return (_.sum(t.store) < t.storeCapacity);
            });
        }

        const deliverTarget = creep.pos.findClosestByPath(deliverTargets) as Structure;

        if (deliverTarget)
        {
            this.fork(DeliverProcess, creep.name + "-deliver", this.priority, {
                creep: creep.name,
                target: deliverTarget.id,
                resource: RESOURCE_ENERGY
            });
        }
    }
}
