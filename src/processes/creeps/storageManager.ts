import { CollectProcess } from "./actions/collect";
import { CreepProcess } from "./creepProcess";
import { DeliverProcess } from "./actions/deliver";

export class StorageManagerCreepProcess extends CreepProcess
{
    public type = "smcreep";

    public run(): void
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

        if (creep.store.getUsedCapacity() === 0)
        {
            if (link.store[RESOURCE_ENERGY] > 0)
            {
                this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                    target: link.id,
                    creep: creep.name,
                    resource: RESOURCE_ENERGY
                });
            }

            return;
        }

        if (creep.room.storage.store.getFreeCapacity() > 0)
        {
            this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
                creep: creep.name,
                target: creep.room.storage.id,
                resource: RESOURCE_ENERGY
            });
        }
    }
}
