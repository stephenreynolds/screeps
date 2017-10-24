import { LifetimeProcess } from "../../OS/LifetimeProcess";

import { Utils } from "lib/Utils";
import { BuildProcess } from "../CreepActions/Build";
import { DeliverProcess } from "../CreepActions/Deliver";
import { HarvestProcess } from "../CreepActions/Harvest";
import { MoveProcess } from "../CreepActions/Move";
import { RepairProcess } from "../CreepActions/Repair";

export class RemoteMinerLifetimeProcess extends LifetimeProcess
{
    public type = "rmlf";

    public run()
    {
        const creep = this.getCreep();

        if (!creep)
        {
            return;
        }

        const flag = Game.flags[this.metaData.flag];

        if (!flag)
        {
            this.completed = true;
            return;
        }

        if (creep.room.name === flag.pos.roomName)
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

        if (_.sum(creep.carry) === 0)
        {
            if (!creep.pos.isNearTo(flag))
            {
                this.fork(MoveProcess, "move-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    pos: {
                        x: flag.pos.x,
                        y: flag.pos.y,
                        roomName: flag.pos.roomName
                    },
                    range: 1
                });

                return;
            }

            this.fork(HarvestProcess, "harvest-" + creep.name, this.priority - 1, {
                creep: creep.name,
                source: flag.memory.source
            });

            return;
        }

        // Deliver energy to room.
        const constructionSites = creep.room.find<ConstructionSite>(FIND_MY_CONSTRUCTION_SITES);
        if (constructionSites[0])
        {
            const site = creep.pos.findClosestByRange(constructionSites);
            this.fork(BuildProcess, "build-" + creep.name, this.priority - 1, {
                creep: creep.name,
                site: site.id
            });
        }
        else
        {
            const structures = _.filter(creep.room.find<Structure>(FIND_MY_STRUCTURES), (s: Structure) =>
            {
                return s.hits < s.hitsMax;
            });

            if (structures[0])
            {
                const structure = creep.pos.findClosestByRange(structures);
                this.fork(RepairProcess, "repair-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    target: structure.id
                });
            }
            else
            {
                this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    target: Game.rooms[this.metaData.deliverRoom].storage!.id,
                    resource: RESOURCE_ENERGY
                });
            }
        }
    }
}
