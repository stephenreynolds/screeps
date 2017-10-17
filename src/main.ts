import { TaskManager } from "TaskManager";

function main()
{
    const taskManager = new TaskManager();
    taskManager.Initialize();
    taskManager.CheckCreeps();
    taskManager.Run();
    taskManager.Finalize();
}

export const loop = main;
