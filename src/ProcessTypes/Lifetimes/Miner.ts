import { LifetimeProcess } from "OS/LifetimeProcess";

import { DeliverProcess } from "../CreepActions/Deliver";
import { HarvestProcess } from "../CreepActions/Harvest";
import { UpgradeProcess } from "../CreepActions/Upgrade";

export class MinerLifetimeProcess extends LifetimeProcess
{
    public type = "mlf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        // Harvest energy from source.
        if (_.sum(creep.carry) === 0)
        {
            this.fork(HarvestProcess, `harvest-${creep.name}`, this.priority - 1, {
                source: this.metaData.source,
                creep: creep.name
            });

            return;
        }

        this.transfer(creep);
    }

    private transfer(creep: Creep)
    {
        const links = creep.pos.findInRange(this.kernel.data.roomData[creep.room.name].links, 1);
        const link = _.find(links, (l: StructureLink) =>
        {
            return l.energy < l.energyCapacity;
        });

        if (creep.memory.linked === undefined)
        {
            creep.memory.linked = false;
        }

        const source = Game.getObjectById(this.metaData.source) as Source;
        const container = source.pos.findInRange(this.kernel.data.roomData[creep.room.name].sourceContainers, 1)[0];

        // Transfer energy to link if it exists, otherwise drop it into container.
        if (link && link.energy < link.energyCapacity && creep.memory.linked === false)
        {
            // Transfer amount equal to 2.5% of what's in container.
            const containerStore = container ? _.sum(container.store) : 0;
            creep.transfer(link, RESOURCE_ENERGY, Math.max(containerStore * 0.025, 10));
            creep.memory.linked = true;
        }
        else if (container && _.sum(container.store) < container.storeCapacity)
        {
            creep.drop(RESOURCE_ENERGY);
            creep.memory.linked = false;
        }
        else
        {
            creep.memory.linked = false;

            // Link and container are full, act as courier instead.
            let targets = [].concat(
                this.kernel.data.roomData[creep.room.name].spawns as never[],
                this.kernel.data.roomData[creep.room.name].extensions as never[]
            );

            let deliverTargets = _.filter(targets, (t: DeliveryTarget) =>
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
                    return (t.energy < t.energyCapacity - 250);
                });
            }

            if (deliverTargets.length === 0)
            {
                targets = [].concat(
                    this.kernel.data.roomData[creep.room.name].labs as never[],
                    this.kernel.data.roomData[creep.room.name].generalContainers as never[]
                );

                deliverTargets = _.filter(targets, (t: DeliveryTarget) =>
                {
                    if (t.store)
                    {
                        return (_.sum(t.store) < t.storeCapacity);
                    }
                    else
                    {
                        return (t.energy < t.energyCapacity);
                    }
                });
            }

            const target = creep.pos.findClosestByPath(deliverTargets) as Structure;

            if (target)
            {
                this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    target: target.id,
                    resource: RESOURCE_ENERGY
                });
            }
            else
            {
                // If there is no where to deliver to, upgrade.
                this.fork(UpgradeProcess, creep.name + "-upgrade", this.priority, {
                    creep: creep.name
                });
            }
        }
    }
}
