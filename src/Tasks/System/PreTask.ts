import { AbstractTask } from "../AbstractTask";

export class PreTask extends AbstractTask
{
    public Initialize(): void
    {
        // Do nothing
    }

    public CheckCreeps(): void
    {
        // Do nothing
    }

    public Run(): void
    {
        for (const name in Memory.creeps)
        {
            if (!Game.creeps[name])
            {
                delete Memory.creeps;
            }
        }
    }

    public Finalize(): void
    {
        // Do nothing
    }
}
