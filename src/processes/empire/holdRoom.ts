import { Process } from "processes/process";
import { Utils } from "utils/utils";

import { HoldProcess } from "../creeps/actions/hold";

export class HoldRoomProcess extends Process
{
    public type = "holdroom";

    public run()
    {
        const flag = Game.flags[this.metaData.flag];

        if (!flag)
        {
            this.completed = true;
            return;
        }

        const creep = Game.creeps[this.metaData.creep];

        if (!creep)
        {
            // Spawn a new Creep
            const spawned = Utils.spawn(
                this.scheduler,
                Utils.nearestRoom(flag.pos.roomName, 1300),
                "hold",
                "h-" + flag.pos.roomName + "-" + Game.time,
                {}
            );

            if (spawned)
            {
                this.metaData.creep = "h-" + flag.pos.roomName + "-" + Game.time;
            }
        }
        else
        {
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

            // Use the existing creep
            this.fork(HoldProcess, "hold-" + creep.name, 30, {
                flag: flag.name,
                creep: creep.name
            });
        }
    }
}
