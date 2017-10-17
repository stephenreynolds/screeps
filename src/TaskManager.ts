import { AbstractTask } from "Tasks/AbstractTask";
import { RoomDataTask } from "./Tasks/System/RoomDataTask";
import { RoomLayoutTask } from "./Tasks/System/RoomLayoutTask";

export class TaskManager
{
    public tasks: AbstractTask[] = [];

    public constructor()
    {
        for (const roomName in Game.rooms)
        {
            const room = Game.rooms[roomName];

            this.tasks.push(new RoomDataTask(room));

            if (room.controller!.my)
            {
                this.tasks.push(new RoomLayoutTask(room));
            }
        }
    }

    public Initialize(): void
    {
        for (const task of this.tasks)
        {
            task.Initialize();
        }
    }

    public CheckCreeps(): void
    {
        for (const task of this.tasks)
        {
            task.CheckCreeps();
        }
    }

    public Run(): void
    {
        for (const task of this.tasks)
        {
            task.Run();
        }
    }

    public Finalize(): void
    {
        for (const task of this.tasks)
        {
            task.Finalize();
        }
    }
}
