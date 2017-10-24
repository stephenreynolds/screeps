import { CollectProcess } from "ProcessTypes/CreepActions/Collect";
import { DeliverProcess } from "ProcessTypes/CreepActions/Deliver";
import { LifetimeProcess } from "../../OS/LifetimeProcess";

export class StorageManagerLifetime extends LifetimeProcess
{
    public type = "smlf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        const link = Game.getObjectById<StructureLink>(this.metaData.link);

        if (!link || !creep.room.storage)
        {
            this.completed = true;
            return;
        }

        if (_.sum(creep.carry) === 0)
        {
            if (link.energy > 0)
            {
                this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                    target: link.id,
                    creep: creep.name,
                    resource: RESOURCE_ENERGY
                });
            }

            return;
        }

        if (_.sum(creep.room.storage.store) < creep.room.storage.storeCapacity)
        {
            this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
                creep: creep.name,
                target: creep.room.storage.id,
                resource: RESOURCE_ENERGY
            });
        }
    }
}
