import { BuildProcess } from "./actions/build";
import { CollectProcess } from "./actions/collect";
import { CreepProcess } from "./creepProcess";
import { DeliverProcess } from "./actions/deliver";
import { HarvestProcess } from "./actions/harvest";
import { UpgradeProcess } from "./actions/upgrade";
import { Utils } from "utils/utils";

export class HarvesterCreepProcess extends CreepProcess
{
    public type = "hcreep";

    public run(): void
    {
        const creep = this.getCreep();

        if (creep)
        {
            if (creep.store.getUsedCapacity() === 0)
            {
                this.onCarryEmpty(creep);
            }
            else
            {
                this.onCarryFull(creep);
            }
        }
    }

    private onCarryEmpty(creep: Creep): void
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
                creep: creep.name,
                source: this.metaData.source
            });
        }
    }

    private onCarryFull(creep: Creep): void
    {
        const source = Game.getObjectById(this.metaData.source) as Source;

        // Construct sites in immediate vicinity.
        const constructionSites = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
        if (constructionSites.length > 0)
        {
            this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
                creep: creep.name,
                site: constructionSites[0].id
            });

            return;
        }

        // Deliver energy to structures.
        let deliverTargets;

        const towers = _.filter(this.scheduler.data.roomData[creep.room.name].towers, (t: StructureTower) =>
        {
            return t.energy < 500;
        });

        if (!towers[0])
        {
            const targets = [].concat(
                this.scheduler.data.roomData[creep.room.name].spawns as never[],
                this.scheduler.data.roomData[creep.room.name].extensions as never[]
            );

            deliverTargets = _.filter(targets, (t: DeliveryTarget) =>
            {
                return (t.energy < t.energyCapacity);
            });

            if (deliverTargets.length === 0)
            {
                const targs = [].concat(
                    this.scheduler.data.roomData[creep.room.name].towers as never[]
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
                    this.scheduler.data.roomData[creep.room.name].generalContainers.length === 0
                    &&
                    !creep.room.storage
                    &&
                    this.scheduler.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source]
                    &&
                    this.scheduler.getProcessByName("eman-" + creep.room.name).metaData.courierCreeps[
                    this.scheduler.data.roomData[creep.room.name].sourceContainerMaps[this.metaData.source].id]
                )
            )
            {
                // If there is no where to deliver to
                this.scheduler.addProcess(UpgradeProcess, creep.name + "-upgrade", this.priority, {
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
