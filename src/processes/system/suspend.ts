import { Process } from "processes/process";

export class SuspendProcess extends Process
{
    public type = "suspend";

    public run()
    {
        this.scheduler.suspendCount = 0;

        _.forEach(this.scheduler.processTable, (process: Process) =>
        {
            this.scheduler.suspendCount++;

            if (typeof process.suspend === "number")
            {
                process.suspend--;
                if (process.suspend === 0)
                {
                    process.suspend = false;
                }
            }
            else if (typeof process.suspend === "string")
            {
                if (!process.scheduler.hasProcess(process.suspend) ||
                    process.scheduler.getProcessByName(process.suspend).completed)
                {
                    process.suspend = false;
                }
            }
        });

        this.completed = true;
    }
}
