import { MoveProcess } from "./move";
import { Process } from "processes/process";

export class HoldProcess extends Process
{
    public type = "hold";

    public run(): void
    {
        const creep = Game.creeps[this.metaData.creep];
        const flag = Game.flags[this.metaData.flag];
        const controller = creep.room.controller;

        if (!(creep && flag && controller))
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

        if (!creep.pos.isNearTo(flag.pos))
        {
            this.fork(MoveProcess, "move-" + creep.name, 30, {
                creep: creep.name,
                pos: flag.pos,
                range: 1
            });
            return;
        }
        else
        {
            creep.reserveController(controller);
            creep.signController(controller, "Colony of kumikill. Attempt no spawning here.");
        }
    }
}
