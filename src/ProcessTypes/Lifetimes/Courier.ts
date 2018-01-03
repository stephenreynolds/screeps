import { LifetimeProcess } from "../../OS/LifetimeProcess";

import { CollectProcess } from "../CreepActions/Collect";
import { DeliverProcess } from "../CreepActions/Deliver";

export class CourierLifetimeProcess extends LifetimeProcess
{
    public type = "clf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        // Prefer collecting energy from storage, fallback to containers.
        let collectTarget;
        if (creep.room.storage)
        {
            collectTarget = creep.room.storage;
        }
        else
        {
            const generalContainers = this.kernel.data.roomData[this.metaData.roomName].generalContainers;
            collectTarget = creep.pos.findClosestByPath(_.filter(generalContainers, (c: StructureContainer) =>
            {
                return _.sum(c.store) < c.storeCapacity;
            }));
        }

        if (!collectTarget)
        {
            this.suspend = 10;
            return;
        }

        if (_.sum(creep.carry) === 0)
        {
            this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                target: collectTarget.id,
                creep: creep.name,
                resource: RESOURCE_ENERGY
            });

            return;
        }

        /**
         * Transfer energy to spawns or extensions.
         * If spawns and extensions are full, transfer to towers.
         * Transfer to labs or general containers last.
         */
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
                return t.energy < t.energyCapacity;
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
            this.suspend = 10;
        }
    }
}
