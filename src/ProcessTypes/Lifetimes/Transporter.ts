import { LifetimeProcess } from "OS/LifetimeProcess";

import { CollectProcess } from "../CreepActions/Collect";
import { DeliverProcess } from "../CreepActions/Deliver";

export class TransporterLifetimeProcess extends LifetimeProcess
{
    public type = "trlf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        if (_.sum(creep.carry) === 0)
        {
            const sourceContainer = Game.getObjectById<StructureContainer>(this.metaData.sourceContainer);

            if (sourceContainer)
            {
                this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                    target: sourceContainer.id,
                    creep: creep.name,
                    resource: RESOURCE_ENERGY
                });
            }
            else
            {
                this.suspend = 10;
            }

            return;
        }

        // Prefer transfering to storage, otherwise general containers.
        let target;
        if (creep.room.storage)
        {
            target = creep.room.storage;
        }
        else
        {
            const generalContainers = this.kernel.data.roomData[this.metaData.roomName].generalContainers;
            target = creep.pos.findClosestByPath(_.filter(generalContainers, (c: StructureContainer) =>
            {
                return c.store[RESOURCE_ENERGY] < c.storeCapacity;
            }));
        }

        if (!target)
        {
            this.suspend = 10;
            return;
        }

        this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
            creep: creep.name,
            target: target.id,
            resource: RESOURCE_ENERGY
        });
    }
}
