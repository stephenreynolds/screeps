import { LifetimeProcess } from "OS/LifetimeProcess";

import { DeliverProcess } from "../CreepActions/Deliver";
import { HarvestProcess } from "../CreepActions/Harvest";
import { MoveProcess } from "../CreepActions/Move";
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

        const container = Game.getObjectById<StructureContainer>(this.metaData.container);

        if (container)
        {
            // Move to source container if on it.
            if (!creep.pos.isEqualTo(container))
            {
                this.kernel.addProcess(MoveProcess, `${creep.name}-mine-move`, this.priority - 1, {
                    creep: creep.name,
                    pos: {
                        x: container.pos.x,
                        y: container.pos.y,
                        roomName: container.pos.roomName
                    }
                });

                this.suspend = `${creep.name}-mine-move`;
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

            // Creep has been harvesting and has energy in it.
            const links = creep.pos.findInRange(this.kernel.data.roomData[creep.room.name].links, 1);
            const link = _.find(links, (l) =>
            {
                return l.energy < l.energyCapacity;
            });

            if (creep.memory.linked === undefined)
            {
                creep.memory.linked = false;
            }

            // Transfer energy to link if it exists, otherwise drop it into container.
            if (link && link.energy < link.energyCapacity && creep.memory.linked === false)
            {
                // Transfer amount equal to 2.5% of what's in container.
                creep.transfer(link, RESOURCE_ENERGY, Math.max(_.sum(container.store) * 0.025, 10));
                creep.memory.linked = true;
            }
            else if (_.sum(container.store) < container.storeCapacity)
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
                    // If there is no where to deliver to
                    this.kernel.addProcess(UpgradeProcess, creep.name + "-upgrade", this.priority, {
                        creep: creep.name
                    });

                    this.suspend = creep.name + "-upgrade";
                    return;
                }
            }
        }
    }
}
