import { Process } from "./Process";
import { RoomDataProcess } from "./RoomDataProcess";

export class InitProcess extends Process
{
    public type: string = "init";

    public run()
    {
        if (Game.cpu.bucket > 3000)
        {
            this.kernel.limit = (Game.cpu.limit + 500) - 20;
        }

        // Delete nonexisting creeps.
        for (const name in Memory.creeps)
        {
            if (!Game.creeps[name])
            {
                delete Memory.creeps[name];
            }
        }

        // Create processes for each room.
        for (const roomName in Game.rooms)
        {
            this.kernel.addProcess(RoomDataProcess, `roomData-${roomName}`, 50, {
                roomName: roomName
            });
        }

        this.completed = true;
    }
}
