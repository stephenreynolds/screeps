import { LifetimeProcess } from "OS/LifetimeProcess";
import { Utils } from "Utils/Utils";

import { BuildProcess } from "../CreepActions/Build";
import { CollectProcess } from "../CreepActions/Collect";
import { DeliverProcess } from "../CreepActions/Deliver";
import { HarvestProcess } from "../CreepActions/Harvest";
import { UpgradeProcess } from "../CreepActions/Upgrade";

export class HarvesterLifetimeProcess extends LifetimeProcess
{
    public type = "hlf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        if (_.sum(creep.carry) === 0)
        {
            const withdrawTarget = Utils.withdrawTarget(creep, this);

            if (withdrawTarget)
            {
                this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    target: withdrawTarget.id,
                    resource: RESOURCE_ENERGY
                });
            }
            else
            {
                this.fork(HarvestProcess, "harvest-" + creep.name, this.priority - 1, {
                    source: this.metaData.source,
                    creep: creep.name
                });
            }

            return;
        }

        // Creep has been harvesting and has energy in it
        const source = Game.getObjectById(this.metaData.source) as Source;
        const constructionSites = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1) as ConstructionSite[];
        if (constructionSites.length > 0)
        {
            this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
                creep: creep.name,
                site: constructionSites[0].id
            });

            return;
        }

        let deliverTargets;

        const towers = _.filter(this.kernel.data.roomData[creep.room.name].towers, (t: StructureTower) =>
        {
            return t.energy < 500;
        });

        if (!towers[0])
        {
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

            if (
                deliverTargets.length === 0
                ||
                (
                    this.kernel.data.roomData[creep.room.name].generalContainers.length === 0
                    &&
                    !creep.room.storage
                    &&
                    this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source]
                    &&
                    this.kernel.getProcessByName("em-" + creep.room.name).metaData.courierCreeps[
                    this.kernel.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source].id]
                )
            )
            {
                // If there is no where to deliver to
                this.kernel.addProcess(UpgradeProcess, creep.name + "-upgrade", this.priority, {
                    creep: creep.name
                });

                this.suspend = creep.name + "-upgrade";
                return;
            }
        }
        else
        {
            deliverTargets = towers as Structure[];
        }

        // Find the nearest target
        const target = creep.pos.findClosestByPath(deliverTargets) as Structure;

        this.fork(DeliverProcess, creep.name + "-deliver", this.priority, {
            creep: creep.name,
            target: target.id,
            resource: RESOURCE_ENERGY
        });
    }
}
