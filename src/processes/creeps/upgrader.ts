import { CreepProcess } from "./creepProcess";

import { CollectProcess } from "./actions/collect";
import { HarvestProcess } from "./actions/harvest";
import { UpgradeProcess } from "./actions/upgrade";

export class UpgraderCreepProcess extends CreepProcess
{
    public type = "ucreep";

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
            let target: Structure | undefined;

            const links = this.scheduler.data.roomData[creep.room.name].links;
            const generalContainers = this.scheduler.data.roomData[creep.room.name].generalContainers;

            if (generalContainers[0] || (creep.room.storage && creep.room.storage.isActive()) || links[0])
            {
                // Collect from upgrade link if it exists.
                const link = _.find(links, (l: StructureLink) =>
                {
                    return l.energy > 0 && l.pos.inRangeTo(creep.room.controller!.pos, 3);
                });

                if (link && link.energy > 0)
                {
                    target = link;

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
                        target = creep.pos.findClosestByPath(targets) as Structure;
                    }
                    else
                    {
                        // Collect from source containers if no storage or general containers.
                        const sourceContainers = this.scheduler.data.roomData[creep.room.name].sourceContainers;
                        const targets = _.filter(sourceContainers, (c: StructureContainer) =>
                        {
                            return c.store[RESOURCE_ENERGY] > 0;
                        });

                        if (targets)
                        {
                            target = creep.pos.findClosestByPath(targets) as Structure;
                        }
                    }
                }
            }

            if (target)
            {
                this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                    target: target.id,
                    creep: creep.name,
                    resource: RESOURCE_ENERGY
                });
            }
            else
            {
                // Harvest from source if nothing to collect from.
                const source = creep.pos.findClosestByPath(this.scheduler.data.roomData[creep.room.name].sources);
                this.fork(HarvestProcess, `harvest-${creep.name}`, this.priority - 1, {
                    source: source,
                    creep: creep.name
                });
            }
        }

        // If the creep has been refilled
        this.fork(UpgradeProcess, "upgrade-" + creep.name, this.priority - 1, {
            creep: creep.name
        });
    }
}
