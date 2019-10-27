import { CreepProcess } from "./creepProcess";
import { CollectProcess } from "./actions/collect";
import { DeliverProcess } from "./actions/deliver";

export class TransporterCreepProcess extends CreepProcess
{
    public type = "trcreep";

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

        let target: Structure;

        // Prefer delivering to general containers, fallback to storage, then other structures.
        const generalContainer = _.filter(this.scheduler.data.roomData[this.metaData.roomName].generalContainers, (c: StructureContainer) =>
        {
            return c.store[RESOURCE_ENERGY] < c.storeCapacity && c.isActive();
        })[0];

        if (generalContainer)
        {
            target = generalContainer;
        }
        else if (creep.room.storage && creep.room.storage.isActive() && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity)
        {
            target = creep.room.storage;
        }
        else
        {
            const spawns = _.filter(this.scheduler.data.roomData[creep.room.name].spawns, (s) => s.isActive());
            const extensions = _.filter(this.scheduler.data.roomData[creep.room.name].extensions, (e) => e.isActive());
            let targets = [].concat(
                spawns as never[],
                extensions as never[]
            );

            let deliverTargets = _.filter(targets, (t: DeliveryTarget) =>
            {
                return t.energy < t.energyCapacity;
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

            if (deliverTargets.length === 0)
            {
                const labs = _.filter(this.scheduler.data.roomData[creep.room.name].labs, (l) => l.isActive());
                targets = [].concat(labs as never[]);

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

            target = creep.pos.findClosestByPath(deliverTargets) as Structure;
        }

        if (!target)
        {
            this.suspend = 10;
        }

        this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
            creep: creep.name,
            target: target.id,
            resource: RESOURCE_ENERGY
        });
    }
}
