import { BuildProcess } from "./actions/build";
import { CreepProcess } from "./creepProcess";
import { HarvestProcess } from "./actions/harvest";
import { UpgradeProcess } from "./actions/upgrade";
import { Utils } from "utils/utils";

export class RemoteBuilderCreepProcess extends CreepProcess
{
    public type = "rbcreep";

    public run(): void
    {
        const creep = this.getCreep();
        const site = Game.getObjectById(this.metaData.site) as ConstructionSite;

        if (!creep)
        {
            return;
        }

        if (!site)
        {
            this.completed = true;
            return;
        }

        if (creep.room.name === site.pos.roomName)
        {
            if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0)
            {
                if (!Memory.remoteRoomStatus)
                {
                    Memory.remoteRoomStatus = {};
                }

                Memory.remoteRoomStatus[creep.room.name] = false;

                Utils.spawnEscort(this, creep);
            }
            else
            {
                if (!Memory.remoteRoomStatus)
                {
                    Memory.remoteRoomStatus = {};
                }

                Memory.remoteRoomStatus[creep.room.name] = true;
            }
        }

        if (creep.store.getUsedCapacity() === 0)
        {
            const source = site.pos.findClosestByRange(this.scheduler.data.roomData[site.pos.roomName].sources);
            if (source)
            {
                this.fork(HarvestProcess, "harvest-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    source: source.id
                });

                return;
            }
        }

        const controller = creep.room.controller;
        if (controller && (controller.level < 2 || controller.ticksToDowngrade < 4000))
        {
            this.fork(UpgradeProcess, "upgrade-" + creep.name, this.priority - 1, {
                creep: creep.name
            });

            return;
        }

        this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
            creep: creep.name,
            site: site.id
        });
    }
}
