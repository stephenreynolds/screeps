import { CollectProcess } from "./actions/collect";
import { CreepProcess } from "./creepProcess";
import { DeliverProcess } from "./actions/deliver";

export class CourierCreepProcess extends CreepProcess
{
    public type = "ccreep";

    public run(): void
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        if (creep.store.getFreeCapacity() === 0)
        {
            this.deliverEnergy(creep);
        }
        else
        {
            this.collectEnergy(creep);
        }
    }

    private collectEnergy(creep: Creep): void
    {
        // Prefer collecting energy from storage, fallback to containers.
        let collectTarget: Structure;
        if (creep.room.storage && creep.room.storage.store.getUsedCapacity() > 0)
        {
            collectTarget = creep.room.storage;
        }
        else
        {
            const generalContainers = this.scheduler.data.roomData[this.metaData.roomName].generalContainers;
            collectTarget = creep.pos.findClosestByPath(_.filter(generalContainers, (c: StructureContainer) =>
            {
                return c.store.getUsedCapacity() > 0;
            })) as Structure;
        }

        // Collect from target if one exists, suspend if not.
        if (collectTarget)
        {
            this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                target: collectTarget.id,
                creep: creep.name,
                resource: RESOURCE_ENERGY
            });

            return;
        }
        else if (creep.store.getUsedCapacity() === 0)
        {
            this.suspend = 10;
            return;
        }
    }

    private deliverEnergy(creep: Creep): void
    {
        /**
         * Transfer energy to spawns or extensions.
         * If spawns and extensions are full, transfer to towers.
         * Transfer to labs or general containers last.
         */
        let targets = [].concat(
            this.scheduler.data.roomData[creep.room.name].spawns as never[],
            _.filter(this.scheduler.data.roomData[creep.room.name].extensions, (e) => e.isActive()) as never[]
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
            targets = [].concat(
                this.scheduler.data.roomData[creep.room.name].labs as never[],
                this.scheduler.data.roomData[creep.room.name].generalContainers as never[]
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
            this.suspend = 10;
        }
    }
}
