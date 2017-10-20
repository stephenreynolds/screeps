import { Process } from "os/process";

export class LifetimeProcess extends Process
{
    /** Returns the creep if it is alive, or completes the process */
    public getCreep(): Creep | false
    {
        if (Game.creeps[this.metaData.creep])
        {
            return Game.creeps[this.metaData.creep];
        }
        else
        {
            this.completed = true;
            return false;
        }
    }
}
