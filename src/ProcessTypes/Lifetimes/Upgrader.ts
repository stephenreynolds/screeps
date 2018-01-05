import { LifetimeProcess } from "OS/LifetimeProcess";

import { CollectProcess } from "../CreepActions/Collect";
import { HarvestProcess } from "../CreepActions/Harvest";
import { UpgradeProcess } from "../CreepActions/Upgrade";

export class UpgraderLifetimeProcess extends LifetimeProcess
{
    public type = "ulf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        // Collect energy.
        if (_.sum(creep.carry) === 0)
        {
            const links = this.kernel.data.roomData[creep.room.name].links;
            const generalContainers = this.kernel.data.roomData[creep.room.name].generalContainers;

            if (generalContainers[0] || creep.room.storage || links[0])
            {
                // Collect from upgrade link if it exists.
                const link = _.find(links, (l: StructureLink) =>
                {
                    return l.energy > 0 && l.pos.inRangeTo(creep.room.controller!.pos, 3);
                });

                if (link && link.energy > 0)
                {
                    this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                        target: link.id,
                        creep: creep.name,
                        resource: RESOURCE_ENERGY
                    });

                    return;
                }
                else
                {
                    // Collect from storage or general containers if link doesn't exists.
                    let targets = [].concat(
                        generalContainers as never[],
                        creep.room.storage as never
                    ) as DeliveryTarget[];

                    const capacity = creep.carryCapacity;

                    targets = _.filter(targets, (t: DeliveryTarget) =>
                    {
                        return t && (t.store[RESOURCE_ENERGY] > capacity);
                    });

                    if (targets.length > 0)
                    {
                        const target = creep.pos.findClosestByPath(targets);

                        this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                            target: target.id,
                            creep: creep.name,
                            resource: RESOURCE_ENERGY
                        });

                        return;
                    }
                }
            }
            else
            {
                // Collect from source containers if no storage or general containers.
                const sourceContainers = this.kernel.data.roomData[creep.room.name].sourceContainers;
                const targets = _.filter(sourceContainers, (c: StructureContainer) =>
                {
                    return c.store[RESOURCE_ENERGY] > 0;
                });

                if (targets)
                {
                    const target = creep.pos.findClosestByPath(targets) as Structure;

                    this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                        target: target.id,
                        creep: creep.name,
                        resource: RESOURCE_ENERGY
                    });

                    return;
                }
                else
                {
                    // Harvest from source if nothing to collect from.
                    const source = creep.pos.findClosestByPath(this.kernel.data.roomData[creep.room.name].sources);
                    this.fork(HarvestProcess, `harvest-${creep.name}`, this.priority - 1, {
                        source: source,
                        creep: creep.name
                    });
                }
            }
        }

        // If the creep has been refilled
        this.fork(UpgradeProcess, "upgrade-" + creep.name, this.priority - 1, {
            creep: creep.name
        });
    }
}
