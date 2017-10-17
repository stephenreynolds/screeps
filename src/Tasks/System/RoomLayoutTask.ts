import { AbstractTask } from "../AbstractTask";

export class RoomLayoutTask extends AbstractTask
{
    private room: Room;

    public constructor(room: Room)
    {
        super();
        this.room = room;
    }

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
        // Do nothing
    }

    public Finalize(): void
    {
        // Do nothing
    }
}
