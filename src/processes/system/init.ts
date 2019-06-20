import { Process } from "OS/Process";
import { SuspendProcess } from "./suspend";
import { RoomDataProcess } from "./roomData";
import { EnergyManagementProcess } from "processes/management/energyManagement";
import { FlagManagementProcess } from "processes/management/flagManagement";

export class InitProcess extends Process
{
    public type = "init";

    public run()
    {
        // Delete nonexistent creeps and draw visuals.
        for (const name in Memory.creeps)
        {
            const creep = Game.creeps[name];

            if (!creep)
            {
                delete Memory.creeps[name];
            }
            else if (creep.memory.visual)
            {
                creep.room.visual.circle(creep.pos, {
                    fill: "transparent", radius: 0.55, stroke: creep.memory.visual
                });
            }
        }

        // Run room processes.
        _.forEach(Game.rooms, (room: Room) =>
        {
            if (room.controller && room.controller.my)
            {
                this.scheduler.addProcess(RoomDataProcess, "roomdata-" + room.name, 99, {
                    roomName: room.name
                });

                this.scheduler.addProcessIfNotExist(EnergyManagementProcess, "eman-" + room.name, 50, {
                    roomName: room.name
                });

                this.scheduler.addProcessIfNotExist(EnergyManagementProcess, "sman-" + room.name, 48, {
                    roomName: room.name
                });
            }
        });

        this.scheduler.addProcess(SuspendProcess, "suspend", 99);
        this.scheduler.addProcess(FlagManagementProcess, "flag", 98);

        this.completed = true;
    }
}
