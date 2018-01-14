import { Process } from "OS/Process";
import { Utils } from "Utils/Utils";

import { MoveProcess } from "../CreepActions/Move";

import { BuildSpawnProcess } from "./BuildSpawn";

interface ClaimProcessMetaData
{
    creep: string;
    targetRoom: string;
    flagName: string;
}

export class ClaimProcess extends Process
{
    public metaData: ClaimProcessMetaData;
    public type = "claim";

    public run()
    {
        const creep = Game.creeps[this.metaData.creep];

        const flag = Game.flags[this.metaData.flagName];

        if (!flag)
        {
            this.completed = true;
            return;
        }

        if (!creep)
        {
            const creepName = "claim-" + this.metaData.targetRoom + "-" + Game.time;
            const spawned = Utils.spawn(
                this.kernel,
                Utils.nearestRoom(this.metaData.targetRoom, 550),
                "claimer",
                creepName,
                {}
            );

            if (spawned)
            {
                this.metaData.creep = creepName;
            }

            return;
        }

        const room = Game.rooms[this.metaData.targetRoom];

        if (!room)
        {
            this.fork(MoveProcess, "move-" + creep.name, this.priority - 1, {
                creep: creep.name,
                pos: flag.pos,
                range: 1
            });
        }
        else
        {
            const claimed = creep.claimController(creep.room.controller!);

            if (claimed === OK)
            {
                this.kernel.addProcess(BuildSpawnProcess, `bsp-${creep.room.name}`, this.priority, {
                    pos: flag.pos,
                    roomName: Utils.nearestRoom(this.metaData.targetRoom, 0)
                });
                flag.remove();
                creep.suicide();
                this.completed = true;
            }
            else
            {
                this.fork(MoveProcess, "move-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    pos: creep.room.controller!.pos,
                    range: 1
                });
            }
        }
    }
}
