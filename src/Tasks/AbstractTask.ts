export abstract class AbstractTask
{
    protected room: Room;

    public constructor(room: Room)
    {
        this.room = room;
    }

    public abstract Initialize(): void;
    public abstract CheckCreeps(): void;
    public abstract Run(): void;
    public abstract Finalize(): void;
}
