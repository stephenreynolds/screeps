import { Process } from "os/process";

export class InvasionManagementProcess extends Process
{
    public type = "invp";

    public run()
    {
        const flag = Game.flags[this.metaData.flag];

        if (!flag)
        {
            this.completed = true;
            return;
        }
    }
}
